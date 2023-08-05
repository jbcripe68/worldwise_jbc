import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesProvider";

function CityItem({ city, active }) {
  const dateStr = new Date(city.date).toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const { position } = city;
  const { onDeleteCity } = useCities();

  function handleDelete(e) {
    e.preventDefault();
    onDeleteCity(city);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          active ? styles["cityItem--active"] : ""
        }`}
        to={`${city.id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{city.emoji}</span>
        <h3 className={styles.name}>{city.cityName}</h3>
        <time className={styles.date}>({dateStr})</time>
        <button className={styles.deleteButton} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
