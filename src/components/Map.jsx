import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  Popup,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useState, useEffect } from "react";
import styles from "./Map.module.css";
import { useCities } from "../contexts/CitiesProvider";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "../components/Button";

function Map() {
  const [position, setPosition] = useState([40, 0]);
  const { cities } = useCities();
  const {
    isLoading: isLoadingPosition,
    position: geoLocation,
    error: geoLocationError,
    getPosition,
  } = useGeolocation();

  if (geoLocationError) {
    console.error(geoLocationError);
  }

  const { lat: mapLat, lng: mapLng } = useUrlPosition();
  useEffect(() => {
    if (mapLat && mapLng) {
      setPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geoLocation) setPosition([geoLocation.lat, geoLocation.lng]);
  }, [geoLocation]);

  function handleGetPosition() {
    if (geoLocation) return setPosition([geoLocation.lat, geoLocation.lng]);
    getPosition();
  }

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={handleGetPosition}>
        {isLoadingPosition ? "Loading..." : "Use your position"}
      </Button>
      <MapContainer
        className={styles.map}
        center={position}
        zoom={6}
        scrollWheelZoom={true}
      >
        <ChangeCenter position={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
              <h6>{city.notes || "No notes"}</h6>
            </Popup>
          </Marker>
        ))}
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.closePopup();
  map.setView(position);
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      console.log(e);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
