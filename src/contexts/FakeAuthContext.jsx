import { createContext, useContext, useReducer } from "react";
import * as Realm from "realm-web";

const AuthContext = createContext();
const mongoApp = new Realm.App({ id: import.meta.env.VITE_MONGO_APPID });

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const DATA_SOURCE_NAME = "mongodb-atlas";
const DATABASE_NAME = "worldwide";
const COLLECTION_NAME = "cities";

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  async function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      let mongoUser = null;
      let collection = null;
      try {
        mongoUser = await mongoApp.logIn(
          Realm.Credentials.emailPassword(email, password)
        );
        console.log(mongoUser);
        const mongo = mongoApp.currentUser.mongoClient(DATA_SOURCE_NAME);
        collection = mongo.db(DATABASE_NAME).collection(COLLECTION_NAME);
      } catch (err) {
        console.log(`Mongo login error: ${err}`);
      }

      dispatch({
        type: "login",
        payload: { ...FAKE_USER, mongoUser, collection },
      });
      return true;
    }
    return false;
  }

  async function logout() {
    try {
      if (user.mongoUser) await user.mongoUser.logOut();
    } catch (err) {
      console.error(`Mongo logout error: ${err}`);
    }
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthContext was used outside of the AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
