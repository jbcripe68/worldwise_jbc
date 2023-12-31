import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesProvider";
import { useUrlPosition } from "../hooks/useUrlPosition";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [countryEmoji, setCountryEmoji] = useState("🇺🇸");
  const [geoCodingError, setGetCodingError] = useState("");

  const { lat, lng } = useUrlPosition();
  const {
    onAddCity,
    isLoading: isAdding,
    error: addingError,
    clearError,
  } = useCities();

  useEffect(
    function () {
      clearError();
      if (!lat || !lng) return;

      async function fetchCityData() {
        try {
          setGetCodingError("");
          setIsLoadingGeoCoding(true);
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const json = await res.json();
          console.log(json);
          if (!json.countryCode) {
            throw new Error(
              "That doesn't seem to be a city, please try again 😜"
            );
          }
          setCityName(json.city || json.locality || "");
          setCountry(json.countryName);
          setCountryEmoji(convertToEmoji(json.countryCode));
        } catch (err) {
          setGetCodingError(err.message);
        } finally {
          setIsLoadingGeoCoding(false);
        }
      }
      fetchCityData();
    },
    [lat, lng, clearError]
  );

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    if (
      await onAddCity({
        cityName,
        country,
        emoji: countryEmoji,
        date,
        notes,
        position: {
          lat,
          lng,
        },
      })
    ) {
      setCityName("");
      setCountry("");
      setCountryEmoji("");
      setDate(Date.now());
      setNotes("");
      navigate("/app/cities");
    }
  }

  if (isLoadingGeoCoding) return <Spinner />;
  if (geoCodingError) return <Message message={geoCodingError} />;
  if (addingError)
    return <Message message={addingError} onClickHandler={clearError} />;
  if (!lat || !lng)
    return <Message message="Start by clicking somewhere on the map" />;

  return (
    <form
      className={`${styles.form} ${isAdding ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {<span className={styles.flag}>{countryEmoji}</span>}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
