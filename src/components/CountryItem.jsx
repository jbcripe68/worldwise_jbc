import { Link } from "react-router-dom";
import styles from "./CountryItem.module.css";

function CountryItem({ country, active }) {
  return (
    <li>
      <Link
        className={`${styles.countryItem} ${
          active ? styles["countryItem--active"] : ""
        }`}
        to={`/app/countries/${country.id}?lat=${country.position.lat}&lng=${country.position.lng}`}
      >
        <span>{country.emoji}</span>
        <span>{country.country}</span>
      </Link>
    </li>
  );
}

export default CountryItem;
