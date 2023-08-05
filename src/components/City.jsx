import { useParams, useSearchParams } from "react-router-dom";
import styles from "./City.module.css";
import ButtonBack from "./ButtonBack";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesProvider";
import { useEffect } from "react";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

// TEMP DATA
// const currentCity = {
//   cityName: "Lisbon",
//   emoji: "🇵🇹",
//   date: "2027-10-31T15:59:59.138Z",
//   notes: "My favorite city so far!",
// };

function City() {
  const cityId = useParams().cityId;
  const { getCity, currentCity, isLoading } = useCities();
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  useEffect(() => {
    getCity(cityId);
  }, [cityId, getCity]);

  if (isLoading) return <Spinner />;
  if (!currentCity?.cityName) return <div>No city</div>;

  const { cityName, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>
          City name {lat} {lng}
        </h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <ButtonBack />
      </div>
    </div>
  );
}

export default City;
