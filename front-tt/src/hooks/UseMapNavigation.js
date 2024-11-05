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

  return {
    onMapLoad,
    panToLocation,
    setMapZoom,
  };
};

export default useMapNavigation;
