import React from 'react';
import MapComponent from '../components/MapComponent';
import useMapNavigation from '../hooks/UseMapNavigation';

const Home = () => {
  const { onMapLoad, panToLocation, setMapZoom } = useMapNavigation();

  return (
    <div>
      <h1>Mapa Interactivo</h1>
      <script src="//maps.google.com/maps?file=api&v=2&key=AIzaSyCYe-T8usnyG3BdsFqZV5ySYIhsSbWSMNs"></script>
      <MapComponent center={{ lat: 19.432608, lng: -99.133209 }} zoom={10} onMapLoad={onMapLoad} />
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => panToLocation(19.432608, -99.133209)}>CDMX</button>
        <button onClick={() => setMapZoom(12)}>Zoom In</button>
        <button onClick={() => setMapZoom(8)}>Zoom Out</button>
      </div>
    </div>
  );
};

export default Home;
