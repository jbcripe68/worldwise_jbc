import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import styles from "./AppLayout.module.css";
import { useAuth } from "../contexts/FakeAuthContext";
import User from "../components/User";

function AppLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      {isAuthenticated && <User />}
    </div>
  );
}

export default AppLayout;
