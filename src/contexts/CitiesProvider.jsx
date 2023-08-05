import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import { useAuth } from "./FakeAuthContext";

//const BASEURL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
        error: "",
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
        currentCity: {},
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/added":
      return {
        ...state,
        isLoading: false,
        cities: [
          ...state.cities.filter((c) => c.id !== action.payload.id),
          action.payload,
        ],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((c) => c.id !== action.payload.id),
        currentCity: {},
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "clearError":
      return {
        ...state,
        error: "",
      };
    default:
      return {
        ...state,
        isLoading: false,
        error: `unknown action ${action.type}`,
      };
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { user } = useAuth();

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        //const res = await fetch(`${BASEURL}/cities`);
        //const json = await res.json();
        const json = await user.collection.find({});
        console.log(`fetchCities result: ${JSON.stringify(json)}`);
        // add id element to each record as the string of _id
        // (which is an oid)
        dispatch({
          type: "cities/loaded",
          payload: json.map((doc) => {
            return { id: doc._id.toString(), ...doc };
          }),
        });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: `Something went wrong getting cities: ${err.message}`,
        });
      }
    }
    fetchCities();
  }, [user]);

  const getCity = useCallback(
    async function doGetCity(cityId) {
      console.log(`current: ${currentCity.id?.toString()} vs ${cityId}`);
      if (currentCity.id?.toString() === cityId) return;

      dispatch({ type: "loading" });
      try {
        //console.log(`Fetching city: ${BASEURL}/cities?id=${cityId}`);
        //const res = await fetch(`${BASEURL}/cities?id=${cityId}`);
        //if (!res.ok) {
        //  throw new Error(
        //    `Bad result from getting city with id ${cityId}.  Status ${res.status}:${res.statusText}`
        //  );
        //}
        //const data = await res.json();
        //console.log(data);
        // must search for _id as an oid
        const json = await user.collection.find({ _id: { $oid: cityId } });
        // add the id as the string of the _id (which is an oid)
        json[0].id = json[0]._id.toString();
        console.log(`getCity result: ${JSON.stringify(json)}`);
        dispatch({ type: "city/loaded", payload: json[0] });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: `Something went wrong getting city with id ${cityId}: ${err.message}`,
        });
      }
    },
    [currentCity.id, user?.collection]
  );

  async function addCity(city) {
    dispatch({ type: "loading" });
    try {
      // const res = await fetch(`${BASEURL}/cities`, {
      //   method: "POST",
      //   headers: {
      //     "Content-type": "application/json",
      //   },
      //   body: JSON.stringify(city),
      // });
      //console.log(res);
      // if (!res.ok) {
      //   throw new Error(
      //     `Bad result from adding city.  Status ${res.status}:${res.statusText}`
      //   );
      // }
      // do this to set the currentCity to new one
      //await getCity(city.id);
      //const data = await res.json();
      //console.log(data);
      const json = await user.collection.insertOne(city);
      console.log(`addCity result: ${JSON.stringify(json)}`);
      // there will be no _id in this record but it is never used
      dispatch({
        type: "city/added",
        payload: { id: json.insertedId.toString(), ...city },
      });
      return true;
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: `Something went wrong adding city ${city.cityName}: ${err.message}`,
      });
    }
    return false;
  }

  async function deleteCity(city) {
    dispatch({ type: "loading" });
    try {
      //const res = await fetch(`${BASEURL}/cities/${city.id}`, {
      //  method: "DELETE",
      //});
      //if (!res.ok) {
      //  throw new Error(
      //    `Bad result from deleting city ${city.cityName}.  Status ${res.status}:${res.statusText}`
      //  );
      //}
      //const data = await res.json();
      //console.log(data);
      // must use _id as an oid of id (which is a string)
      const json = await user.collection.deleteOne({ _id: { $oid: city.id } });
      console.log(`deleteCity result: ${JSON.stringify(json)}`);
      if (json.deletedCount !== 1) {
        throw new Error("deleteCity did not work properly");
      }
      dispatch({ type: "city/deleted", payload: city });
      return true;
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: `Something went wrong deleting city ${city.cityName} id ${city.id}: ${err.message}`,
      });
    }
    return false;
  }

  const clearError = useCallback(function doClearError() {
    dispatch({ type: "clearError" });
  }, []);

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        onAddCity: addCity,
        onDeleteCity: deleteCity,
        currentCity,
        getCity,
        error,
        clearError,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("CitiesContext used outside of CitiesProvider");
  }
  return context;
}

export { useCities, CitiesProvider };
