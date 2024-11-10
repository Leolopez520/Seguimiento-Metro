import { useRef } from 'react';

const useMapNavigation = () => {
  const mapRef = useRef(null);

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const panToLocation = (lat, lng) => {
    mapRef.current?.panTo({ lat, lng });
  };

  const setMapZoom = (zoomLevel) => {
    mapRef.current?.setZoom(zoomLevel);
  };

  const locateUser = (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          panToLocation(latitude, longitude);
          if (typeof callback === "function") {
            callback(latitude, longitude);
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Permiso de ubicación denegado.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("La información de ubicación no está disponible.");
              break;
            case error.TIMEOUT:
              alert("La solicitud de ubicación ha expirado.");
              break;
            default:
              alert("No se pudo obtener la ubicación.");
              break;
          }
        }
      );
    } else {
      alert("Geolocalización no soportada por el navegador.");
    }
  };

  return {
    onMapLoad,
    panToLocation,
    setMapZoom,
    locateUser,
  };
};

export default useMapNavigation;