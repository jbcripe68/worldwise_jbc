import { useParams } from "react-router-dom";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesProvider";

function CountryList() {
  const { cities, isLoading } = useCities();
  const countryId = useParams().countryId;
  if (isLoading) return <Spinner />;

  if (cities.length === 0)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  const countries = cities.reduce((acc, city) => {
    if (
      acc.find((country) => {
        return country.country === city.country;
      }) === undefined
    ) {
      return [
        ...acc,
        {
          id: city.id,
          emoji: city.emoji,
          country: city.country,
          position: city.position,
        },
      ];
    }
    return acc;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem
          key={country.id}
          country={country}
          active={Number(countryId) === country.id}
        />
      ))}
    </ul>
  );
}

export default CountryList;
