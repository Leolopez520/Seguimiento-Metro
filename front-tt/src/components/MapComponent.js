import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker, OverlayView, InfoWindow } from '@react-google-maps/api';
import io from 'socket.io-client';
import '../styles/MapStyle.css';
import metroImg from '../assets/images/metro/metroimg.png';
import metroImg_inverted from '../assets/images/metro/metroimg_inverted.png';
import stationPin from '../assets/images/pin.png';


const line4Coordinates = [
  {lat : 19.4022357503, lng : -99.1217200028},//empieza en Santa Anita
  {lat : 19.4028915723, lng : -99.1216956040},
  {lat : 19.4035767878, lng : -99.1216669366},
  {lat : 19.4047702230, lng : -99.1216058000},
  {lat : 19.4051425940, lng : -99.1216124840},
  {lat : 19.4054729606, lng : -99.1216406262},
  {lat : 19.4060181187, lng : -99.1216649718},
  {lat : 19.4076117720, lng : -99.1217026977},
  {lat : 19.4103518481, lng : -99.1217343292},
  {lat : 19.4117778580, lng : -99.1217577728},
  {lat : 19.4122605540, lng : -99.1217627670},
  {lat : 19.4127221710, lng : -99.1217502630},
  {lat : 19.4131857360, lng : -99.1217078250},
  {lat : 19.4135836780, lng : -99.1216580280},
  {lat : 19.4209902649, lng : -99.1206163484},
  {lat : 19.4223874943, lng : -99.1204233074},
  {lat : 19.4263387450, lng : -99.1197971010},
  {lat : 19.4276062380, lng : -99.1196097010},
  {lat : 19.4280272772, lng : -99.1195412309},
  {lat : 19.4293994255, lng : -99.1193272088},
  {lat : 19.4311248890, lng : -99.1190828670},
  {lat : 19.4315955180, lng : -99.1190462750},
  {lat : 19.4319780817, lng : -99.1190205508},
  {lat : 19.4325453870, lng : -99.1190062382},
  {lat : 19.4331525208, lng : -99.1189940323},
  {lat : 19.4340877170, lng : -99.1189223580},
  {lat : 19.4349645729, lng : -99.1188518567},
  {lat : 19.4359234803, lng : -99.1187403924},
  {lat : 19.4374757559, lng : -99.1185449203},
  {lat : 19.4380994316, lng : -99.1184304368},
  {lat : 19.4388436267, lng : -99.1183039412},
  {lat : 19.4402440279, lng : -99.1180448337},
  {lat : 19.4425952471, lng : -99.1176089574},
  {lat : 19.4431443102, lng : -99.1175085286},
  {lat : 19.4435805013, lng : -99.1174261664},
  {lat : 19.4440013971, lng : -99.1173316938},
  {lat : 19.4447768760, lng : -99.1171401980},
  {lat : 19.4482230140, lng : -99.1163098172},
  {lat : 19.4496191599, lng : -99.1159679959},
  {lat : 19.4559080020, lng : -99.1144259050},
  {lat : 19.4573135379, lng : -99.1140781808},
  {lat : 19.4587019858, lng : -99.1137346780},
  {lat : 19.4621980950, lng : -99.1128663680},
  {lat : 19.4624106550, lng : -99.1127982660},
  {lat : 19.4625967006, lng : -99.1127326228},
  {lat : 19.4627269235, lng : -99.1126884708},
  {lat : 19.4642437033, lng : -99.1121210999},
  {lat : 19.4655927099, lng : -99.1116186673},
  {lat : 19.4674535011, lng : -99.1107791932},
  {lat : 19.4692497093, lng : -99.1099713267},
  {lat : 19.4718674866, lng : -99.1087598234},
  {lat : 19.4721361029, lng : -99.1086497065},
  {lat : 19.4723242938, lng : -99.1085809230},
  {lat : 19.4725578194, lng : -99.1085062870},
  {lat : 19.4726893528, lng : -99.1084679283},
  {lat : 19.4735445465, lng : -99.1082393315},
  {lat : 19.4749234835, lng : -99.1078545190},
  {lat : 19.4765262648, lng : -99.1074048028},
  {lat : 19.4766984453, lng : -99.1073686120},
  {lat : 19.4768835351, lng : -99.1073369678},
  {lat : 19.4773139684, lng : -99.1072767440},
  {lat : 19.4797762476, lng : -99.1069960565},
  {lat : 19.4804835813, lng : -99.1069163473},
  {lat : 19.4811665346, lng : -99.1068214942},
  {lat : 19.4814520760, lng : -99.1067460454},
  {lat : 19.4816601450, lng : -99.1066720584},
  {lat : 19.4818854442, lng : -99.1065738788},
  {lat : 19.4820806199, lng : -99.1064681157},
  {lat : 19.4822585849, lng : -99.1063532647},
  {lat : 19.4826044908, lng : -99.1060917881},
  {lat : 19.4843504150, lng : -99.1048964230},
  {lat : 19.4850441450, lng : -99.1043694770},
  {lat : 19.4857144066, lng : -99.1038537679},//termina en Martin Carrera
];

// Estaciones terminales
const martinCarrera = { lat: 19.485752693339933, lng: -99.10447595414047 };
const santaAnita = { lat: 19.402838781570377, lng: -99.1216871104352 };

// Cálculo de distancia Haversine
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
};

// Cálculo de rotación
const calculateRotation = (prevPos, currPos) => {
  const dx = currPos.lng - prevPos.lng;
  const dy = currPos.lat - prevPos.lat;
  return Math.atan2(dy, dx) * (180 / Math.PI); // Convertir a grados
};

const MapComponent = ({center, zoom, onMapLoad, panToLocation, setMapZoom, locateUser, userLocation, showPolyline }) => {
  const [trains, setTrains] = useState({});
  const [convoyDirections, setConvoyDirections] = useState({});
  const [selectedConvoy, setSelectedConvoy] = useState(null); // Convoy seleccionado para mostrar info-bubble
  const [stations, setStations] = useState([]); // Lista de estaciones
  const [selectedStation, setSelectedStation] = useState(null); // Estación seleccionada para mostrar InfoWindow
  const socket = useRef(null);

  useEffect(() => {
    // Conectar al servidor
    socket.current = io('http://20.163.180.10:5000');

    // Escuchar evento de nueva ubicación
    socket.current.on('nueva_ubicacion', (data) => {
      const { id_convoy, punto } = data;
      const newLocation = { lat: punto.latitud, lng: punto.longitud };

      setTrains((prevTrains) => {
        const prevTrain = prevTrains[id_convoy];
        const prevLocation = prevTrain?.position || newLocation;

        // Calcular distancias usando Haversine
        const distanceToMartinCarreraPrev = haversineDistance(
          prevLocation.lat,
          prevLocation.lng,
          martinCarrera.lat,
          martinCarrera.lng
        );
        const distanceToMartinCarreraNew = haversineDistance(
          newLocation.lat,
          newLocation.lng,
          martinCarrera.lat,
          martinCarrera.lng
        );

        const distanceToSantaAnitaPrev = haversineDistance(
          prevLocation.lat,
          prevLocation.lng,
          santaAnita.lat,
          santaAnita.lng
        );
        const distanceToSantaAnitaNew = haversineDistance(
          newLocation.lat,
          newLocation.lng,
          santaAnita.lat,
          santaAnita.lng
        );

        // Determinar dirección
        const direction =
          distanceToMartinCarreraNew < distanceToMartinCarreraPrev
            ? 'Martin Carrera'
            : 'Santa Anita';

        // Actualizar dirección del convoy
        setConvoyDirections((prevDirections) => ({
          ...prevDirections,
          [id_convoy]: direction,
        }));

        return {
          ...prevTrains,
          [id_convoy]: {
            position: newLocation,
            rotation: calculateRotation(prevLocation, newLocation),
          },
        };
      });
    });

    return () => {
      // Desconectar al desmontar
      socket.current.off('nueva_ubicacion');
      socket.current.disconnect();
    };
  }, []);

  // Obtener estaciones desde la API
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('http://20.163.180.10:5000/estaciones');
        const data = await response.json();
        if (data.status === 'success') {
          setStations(data.estaciones); // Lista de estaciones
          console.log('Estaciones:', data.estaciones);
        } else {
          console.error('Error al obtener estaciones:', data.message);
        }
      } catch (error) {
        console.error('Error al hacer la solicitud de estaciones:', error);
      }
    };

    fetchStations();
  }, []);

  return (
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
            zoomControl: false,
            clickableIcons: false,
          }}
          >
          
          {/* Agregar la polilínea */}
          {showPolyline && (
            <Polyline
              path={line4Coordinates}
              options={{
                strokeColor: '#62bbb1',
                strokeOpacity: 1,
                strokeWeight:8,
                visible: true,
                zIndex: 10,
              }}
            />
          )}

          {/* Marcadores de estaciones */}
          {stations.map((station) => (
            <Marker
              key={station.id}
              position={{
                lat: parseFloat(station.location.latitude), // Conversión a lat/lng para Google Maps
                lng: parseFloat(station.location.longitude),
              }}
              onClick={() => setSelectedStation(station)}
              icon={{
                url: stationPin,
                scaledSize: new window.google.maps.Size(20, 20),
              }}
            />
          ))}
          

          {/* InfoWindow para estación seleccionada */}
          {selectedStation && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedStation.location.latitud),
                lng: parseFloat(selectedStation.location.longitud),
                }}
              onCloseClick={() => setSelectedStation(null)}
            >
              <div>
                <h4>Estación: {selectedStation.nombre}</h4>
                <p>Línea 4</p>
              </div>
            </InfoWindow>
          )}

          {/* Renderizar los marcadores de convoy */}
          {Object.entries(trains).map(([id_convoy, { position, rotation }]) => {
            const direction = convoyDirections[id_convoy];
            const isSantaAnitaDirection = direction === 'Santa Anita'; // Verifica si va hacia Santa Anita
          
            return (
              <Marker
                key={id_convoy}
                position={position}
                onClick={() => setSelectedConvoy({ id_convoy, position })}
                icon={{
                  url: isSantaAnitaDirection
                    ? metroImg_inverted
                    : metroImg,
                  scaledSize: new window.google.maps.Size(15, 55),
                  anchor: new window.google.maps.Point(25, 25),
                }}
              />
              );
            })}

          {/* Info-bubble para convoy seleccionado */}
          {selectedConvoy && (
            <InfoWindow
              position={selectedConvoy.position}
              onCloseClick={() => setSelectedConvoy(null)}
            >
              <div>
                <h4>Convoy: {selectedConvoy.id_convoy}</h4>
                <p>Dirección: {convoyDirections[selectedConvoy.id_convoy] || 'Calculando...'}</p>
              </div>
            </InfoWindow>
          )}

          {/* Punto azul circular para la ubicación del usuario */}
          {userLocation && (
            <OverlayView
              position={userLocation}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="user-location-circle" />
            </OverlayView>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};
export default MapComponent;