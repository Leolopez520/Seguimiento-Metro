import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import '../styles/MapStyle.css';

const MapComponent = ({ center, zoom, onMapLoad }) => ( 
  <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
    <div className="map-container">
      <GoogleMap
        mapContainerClassName="map-container"
        center={center}
        zoom={zoom}
        onLoad={onMapLoad}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      />
    </div>
  </LoadScript>
);

export default MapComponent;
