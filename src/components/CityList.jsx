import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesProvider";

function CityList() {
  const {
    cities,
    isLoading,
    currentCity,
    error: cityError,
    clearError,
  } = useCities();
  if (isLoading) return <Spinner />;

  if (cities.length === 0)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  if (cityError) {
    return <Message message={cityError} onClickHandler={clearError} />;
  }

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem
          key={city.id}
          city={city}
          active={city.id === currentCity?.id}
        />
      ))}
    </ul>
  );
}

export default CityList;
