import MapView, { Polyline, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Location } from '../../../infraestructure/interface/location';
import { FAB } from '../ui/FAB';
import { USER } from '../ui/USER';
import { useLocationStore } from '../../store/location/useLocationStore';
import { FIXED_ROUTE } from '../../navigation/fixedRoute';

interface Props {
  showUserLocation?: boolean;
  initialLocation: Location;
}

// Función para calcular la rotación entre dos puntos
const calculateRotation = (prevPos: Location, currPos: Location) => {
  const dx = currPos.longitude - prevPos.longitude;
  const dy = currPos.latitude - prevPos.latitude;
  return Math.atan2(dy, dx) * (180 / Math.PI); // Convertir a grados
};

export const Map = ({ showUserLocation = true, initialLocation }: Props) => {
  const mapRef = useRef<MapView>();
  const cameraLocation = useRef<Location>(initialLocation);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [isShowingPolyline, setIsShowingPolyline] = useState(true);
  const [isFollowingConvoy, setIsFollowingConvoy] = useState(false); // Nuevo estado para seguir el convoy
  const [convoyPosition, setConvoyPosition] = useState<Location>(FIXED_ROUTE[0]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [rotation, setRotation] = useState(0); // Estado para la rotación

  const { 
    getLocation, 
    lastKnownLocation, 
    watchLocation, 
    clearWatchLocation, 
    userLocationsList,
  } = useLocationStore();

  const moveCameraToLocation = (location: Location) => {
    if (!mapRef.current) return;
    mapRef.current.animateCamera({ center: location });
  };

  const moveToCurrentLocation = async () => {
    const location = await getLocation();
    if (!location) return;
    moveCameraToLocation(location);
  };

  // Simular movimiento del convoy a lo largo de la ruta fija
  useEffect(() => {
    const interval = setInterval(() => {
      setRouteIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % FIXED_ROUTE.length;
        const prevPosition = FIXED_ROUTE[prevIndex];
        const nextPosition = FIXED_ROUTE[nextIndex];

        // Actualizar la posición del convoy
        setConvoyPosition(nextPosition);

        // Calcular y actualizar la rotación
        const newRotation = calculateRotation(prevPosition, nextPosition);
        setRotation(newRotation);

        // Mover la cámara a la ubicación del convoy si está activado el seguimiento
        if (isFollowingConvoy) {
          moveCameraToLocation(nextPosition);
        }

        return nextIndex;
      });
    }, 5000); // Ajustar el intervalo para controlar la velocidad

    return () => clearInterval(interval);
  }, [isFollowingConvoy]);

  useEffect(() => {
    watchLocation();
    return () => {
      clearWatchLocation();
    };
  }, []);

  useEffect(() => {
    if (lastKnownLocation && isFollowingUser) {
      moveCameraToLocation(lastKnownLocation);
    }
  }, [lastKnownLocation, isFollowingUser]);

  return (
    <>
      <MapView
        ref={(map) => (mapRef.current = map!)}
        showsUserLocation={showUserLocation}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        onTouchStart={() => {
          setIsFollowingUser(false);
          setIsFollowingConvoy(false); // Detener el seguimiento del convoy si se toca el mapa
        }}
        region={{
          latitude: cameraLocation.current.latitude,
          longitude: cameraLocation.current.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        {isShowingPolyline && (
          <Polyline 
            coordinates={FIXED_ROUTE} 
            strokeColor="black" 
            strokeWidth={5} 
          />
        )}

        {/* Renderizar el marcador con imagen rotada dinámicamente */}
        <Marker coordinate={convoyPosition} title="Convoy Simulado"
        anchor={{ x: 0.5, y: 0.5 }}
        >
          
          <Image
            source={require('../../../assets/images/metroimg.png')} // Ruta de la imagen del tren
            style={{ 
              width: 80, 
              height: 80, 
              transform: [{ rotate: `${rotation}deg` }] // Rotación dinámica
            }}
            resizeMode="contain"
          />
        </Marker> 
      </MapView>

      <FAB
        iconName={isShowingPolyline ? 'eye-outline' : 'eye-off-outline'}
        onPress={() => setIsShowingPolyline(!isShowingPolyline)}
        style={{
          bottom: 200,
          right: 20,
        }}
      />

      <FAB
        iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
        onPress={() => {
          setIsFollowingUser(!isFollowingUser);
          if (!isFollowingUser) {
            setIsFollowingConvoy(false); // Desactivar el seguimiento del convoy
          }
        }}
        style={{
          bottom: 140,
          right: 20,
        }}
      />

      <FAB
        iconName={isFollowingConvoy ? 'train-outline' : 'skull-outline'} // Icono para seguir el convoy
        onPress={() => {
          setIsFollowingConvoy(!isFollowingConvoy);
          if (!isFollowingConvoy) {
            setIsFollowingUser(false); // Desactivar el seguimiento del usuario
          }
        }}
        style={{
          bottom: 80,
          right: 20,
        }}
      />

      <FAB
        iconName="compass-outline"
        onPress={moveToCurrentLocation}
        style={{
          bottom: 20,
          right: 20,
        }}
      />

      <USER
        iconName="person-outline"
        onPress={moveToCurrentLocation}
        style={{
          top: 10,
          left: 10,
        }}
      />
    </>
  );
};
