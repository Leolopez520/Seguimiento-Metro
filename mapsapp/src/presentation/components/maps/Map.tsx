import React, {useEffect, useRef, useState} from 'react';
import MapView, {Polyline, PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {Image, Alert} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Location} from '../../../infraestructure/interface/location';
import {FAB} from '../ui/FAB';
import {USER} from '../ui/USER';
import {useLocationStore} from '../../store/location/useLocationStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LINE_4_ROUTE} from '../../../infraestructure/interface/line4Route';
import io from 'socket.io-client';

interface Props {
  showUserLocation?: boolean;
  initialLocation: Location;
}

const calculateRotation = (prevPos: Location, currPos: Location) => {
  const dx = currPos.longitude - prevPos.longitude;
  const dy = currPos.latitude - prevPos.latitude;

  // Calcular el ángulo correcto con atan2 y ajustar según el sistema de coordenadas geográficas
  const angle = Math.atan2(dy, dx); // Resultado en radianes
  return (angle * 180) / Math.PI;
};

type RootStackParamList = {
  UserProfileScreen: {usuario: any};
  // Add other routes here if needed
};

export const Map = ({showUserLocation = true, initialLocation}: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView>();
  const cameraLocation = useRef<Location>(initialLocation);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [isShowingPolyline, setIsShowingPolyline] = useState(true);
  const [isFollowingConvoy, setIsFollowingConvoy] = useState(false);
  const [trains, setTrains] = useState<{
    [key: string]: {position: Location; rotation: number; direction: string};
  }>({});
  const [selectedConvoyId, setSelectedConvoyId] = useState<string | null>(null);
  const [stations, setStations] = useState<
    {
      id: number;
      nombre: string;
      location: {latitude: number; longitude: number};
    }[]
  >([]);
  const {getLocation, lastKnownLocation, watchLocation, clearWatchLocation} =
    useLocationStore();
  const socket = useRef(io('http://20.163.180.10:5000')).current;
  const [estimaciones, setEstimaciones] = useState<{
    [key: string]: number | null;
  }>({});

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se pudo obtener el ID del usuario');
        return;
      }

      const response = await fetch(
        `http://20.163.180.10:5000/obtener_datos_usuario?user_id=${userId}`,
      );
      const data = await response.json();

      if (data.status === 'success') {
        navigation.navigate('UserProfileScreen', {usuario: data.usuario});
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      Alert.alert('Error', 'No se pudo obtener los datos del usuario');
    }
  };

  const moveCameraToLocation = (location: Location) => {
    if (!mapRef.current) return;
    mapRef.current.animateCamera({center: location});
  };

  const moveToCurrentLocation = async () => {
    const location = await getLocation();
    if (!location) return;
    moveCameraToLocation(location);
  };

  const fetchStations = async () => {
    try {
      const response = await fetch('http://20.163.180.10:5000/estaciones');
      const data = await response.json();

      if (data.status === 'success') {
        setStations(data.estaciones);
      } else {
        console.error('Error al obtener estaciones:', data.message);
      }
    } catch (error) {
      console.error('Error al hacer la solicitud de estaciones:', error);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    socket.on('nueva_ubicacion', async data => {
      const {id_convoy, punto} = data;
      const newLocation = {latitude: punto.latitud, longitude: punto.longitud};

      // Actualizar la posición del convoy
      setTrains(prevTrains => ({
        ...prevTrains,
        [id_convoy]: {
          position: newLocation,
          rotation: calculateRotation(
            prevTrains[id_convoy]?.position || newLocation,
            newLocation,
          ),
        },
      }));

      // Obtener el tiempo estimado del convoy
      try {
        const response = await fetch(
          `http://20.163.180.10:5000/estimacion/${id_convoy}`,
        );
        const data = await response.json();

        if (data.status === 'success' && data.estimacion) {
          setEstimaciones(prevEstimaciones => ({
            ...prevEstimaciones,
            [id_convoy]: data.estimacion.tiempo_estimado,
          }));
        }
      } catch (error) {
        console.error('Error fetching estimation:', error);
      }

      // Seguir al convoy seleccionado si está activado
      if (isFollowingConvoy && selectedConvoyId === id_convoy) {
        moveCameraToLocation(newLocation);
      }
    });

    return () => {
      socket.off('nueva_ubicacion');
    };
  }, [isFollowingConvoy, selectedConvoyId]);

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
        ref={map => (mapRef.current = map!)}
        showsUserLocation={showUserLocation}
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        onTouchStart={() => {
          setIsFollowingUser(false);
          setIsFollowingConvoy(false);
        }}
        region={{
          latitude: cameraLocation.current.latitude,
          longitude: cameraLocation.current.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {/* Dibuja la Línea 4 en el mapa */}
        {isShowingPolyline && (
          <Polyline
            coordinates={LINE_4_ROUTE}
            strokeColor="#62bbb1"
            strokeWidth={5}
          />
        )}

        {/* Renderizar marcadores para cada tren */}
        {Object.entries(trains).map(([id_convoy, {position, rotation}]) => (
          <Marker
            key={id_convoy}
            coordinate={position}
            title={`Convoy: ${id_convoy}`}
            description={`Tiempo estimado: ${
              estimaciones[id_convoy]
                ? estimaciones[id_convoy].toFixed(2) + 's'
                : 'Desconocido'
            }`}
            anchor={{x: 0.5, y: 0.5}}
            flat={true} // Asegura que el marcador no rote con el mapa
          >
            <Image
              source={require('../../../assets/images/metroimg.png')}
              style={{
                width: 80,
                height: 80,
                transform: [{rotate: `90deg`}],
              }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {stations.map(station => (
          <Marker
            key={station.id.toString()}
            coordinate={station.location}
            title={`Estación: ${station.nombre}`}
            description={`Línea 4`}>
            <Image
              source={require('../../../assets/images/pin.png')}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
          </Marker>
        ))}
      </MapView>

      <FAB
        iconName={isShowingPolyline ? 'eye-outline' : 'eye-off-outline'}
        onPress={() => setIsShowingPolyline(!isShowingPolyline)}
        style={{
          bottom: 80,
          right: 20,
        }}
      />

      <FAB
        iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
        onPress={() => {
          setIsFollowingUser(!isFollowingUser);
          if (!isFollowingUser) {
            setIsFollowingConvoy(false);
          }
        }}
        style={{
          bottom: 140,
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
        onPress={fetchUserData}
        style={{
          top: 10,
          left: 10,
        }}
      />
    </>
  );
};
