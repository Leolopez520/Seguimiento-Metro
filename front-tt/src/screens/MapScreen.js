import React, {useState} from 'react';
import MapComponent from '../components/MapComponent';
import useMapNavigation from '../hooks/UseMapNavigation';
import '../styles/MapStyle.css';

const Home = () => {
  const { onMapLoad, panToLocation, setMapZoom, locateUser } = useMapNavigation();
  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState({ lat: 19.444048, lng: -99.11716 }); // Ubicación de centro línea 4

  const handleZoomIn = () => {
    const newZoom = zoom + 1;
    setZoom(newZoom);
    setMapZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = zoom - 1;
    setZoom(newZoom);
    setMapZoom(newZoom);
  };


  const handleLocateLine4 = () => {
    const line4Coords = { lat: 19.444048, lng: -99.11716 };
    setCenter(line4Coords);
    panToLocation(line4Coords.lat, line4Coords.lng);
  };


  return (
    <div>
      <h1>Ubica Mi Metro</h1>
      <MapComponent 
        center={center} 
        zoom={zoom} 
        onMapLoad={onMapLoad} 
        panToLocation={panToLocation}
        setMapZoom={setMapZoom}
        locateUser={locateUser}
      />
      <div className="controls-container">
        <button className="map-button" onClick={handleZoomIn}>Zoom In</button>
        <button className="map-button" onClick={handleZoomOut}>Zoom Out</button>
        <button className="map-button" onClick={locateUser}>Ubicar Usuario</button>
        <button className="map-button" onClick={handleLocateLine4}>Ubicar Línea 4</button>
      </div>
    </div>
  );
};

export default Home;