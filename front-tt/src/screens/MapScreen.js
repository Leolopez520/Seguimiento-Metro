import React, {useState} from 'react';
import MapComponent from '../components/MapComponent';
import useMapNavigation from '../hooks/UseMapNavigation';
import '../styles/MapStyle.css';
import Header from '../components/Header'; 

const Home = () => {
  const { onMapLoad, panToLocation, setMapZoom, locateUser } = useMapNavigation();
  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState({ lat: 19.444048, lng: -99.11716 }); // Ubicación de centro línea 4
  const [userLocation, setUserLocation] = useState(null);
  const [showPolyline, setShowPolyline] = useState(false); // Estado para controlar la visibilidad de la polilínea


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
    setShowPolyline(prevState => !prevState);
    const line4Coords = { lat: 19.444048, lng: -99.11716 };
    setCenter(line4Coords);
    panToLocation(line4Coords.lat, line4Coords.lng);
  };

  const handleLocateUser = () => {
    locateUser((lat, lng) => {
      setUserLocation({ lat, lng });
    });
  };

  // Información del usuario (puedes obtener esto de un hook o servicio)
  const userPhoto = 'https://via.placeholder.com/40'; // Reemplaza con la URL real
  const isSuperUser = true; // Cambia según el estado real del usuario

  const handleLogout = () => {
    console.log('Sesión cerrada'); // Agregar lógica para cerrar sesión
  };

  const handleViewUserInfo = () => {
    console.log('Ver información del usuario'); // Agregar lógica para mostrar la información
  };

  const handleManageConvoys = () => {
    console.log('Gestionar convoys'); // Agregar lógica para gestionar convoys
  };

  return (
    <div>
      <Header
        userPhoto={userPhoto}
        isSuperUser={isSuperUser}
        onLogout={handleLogout}
        onViewUserInfo={handleViewUserInfo}
        onManageConvoys={handleManageConvoys}
      />

      <MapComponent 
        center={center} 
        zoom={zoom} 
        onMapLoad={onMapLoad} 
        panToLocation={panToLocation}
        setMapZoom={setMapZoom}
        locateUser={locateUser}
        userLocation={userLocation}
        showPolyline={showPolyline} // Pasa el estado de visibilidad como prop
      />
      <div className="controls-container">
        <button className="map-button" onClick={handleZoomIn}>Zoom In</button>
        <button className="map-button" onClick={handleZoomOut}>Zoom Out</button>
        <button className="map-button" onClick={handleLocateUser}>Ubicar Usuario</button>
        <button className="map-button" onClick={handleLocateLine4}>{
          showPolyline ? 'Ocultar Línea 4' : 'Mostrar Línea 4'}
          </button>
      </div>
    </div>
  );
};

export default Home;