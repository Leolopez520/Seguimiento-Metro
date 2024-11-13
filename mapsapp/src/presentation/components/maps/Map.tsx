import React, { useEffect, useRef, useState } from 'react';
import MapView, { Polyline, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Image, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Location } from '../../../infraestructure/interface/location';
import { FAB } from '../ui/FAB';
import { USER } from '../ui/USER';
import { useLocationStore } from '../../store/location/useLocationStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LINE_4_ROUTE } from '../../../infraestructure/interface/line4Route';
import io from 'socket.io-client';

interface Props {
  showUserLocation?: boolean;
  initialLocation: Location;
}

const calculateRotation = (prevPos: Location, currPos: Location) => {
  const dx = currPos.longitude - prevPos.longitude;
  const dy = currPos.latitude - prevPos.latitude;
  return Math.atan2(dy, dx) * (180 / Math.PI); // Convertir a grados
};

type RootStackParamList = {
  UserProfileScreen: { usuario: any };
  // Add other routes here if needed
};

export const Map = ({ showUserLocation = true, initialLocation }: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView>();
  const cameraLocation = useRef<Location>(initialLocation);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [isShowingPolyline, setIsShowingPolyline] = useState(true);
  const [isFollowingConvoy, setIsFollowingConvoy] = useState(false);
  const [convoyPosition, setConvoyPosition] = useState<Location>(initialLocation);
  const [rotation, setRotation] = useState(0);

  const { getLocation, lastKnownLocation, watchLocation, clearWatchLocation } = useLocationStore();
  const socket = useRef(io("http://20.163.180.10:5000")).current;

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert("Error", "No se pudo obtener el ID del usuario");
        return;
      }
  
      const response = await fetch(`http://20.163.180.10:5000/obtener_datos_usuario?user_id=${userId}`);
      const data = await response.json();
  
      if (data.status === 'success') {
        navigation.navigate('UserProfileScreen', { usuario: data.usuario });
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      Alert.alert("Error", "No se pudo obtener los datos del usuario");
    }
  };
  
  const moveCameraToLocation = (location: Location) => {
    if (!mapRef.current) return;
    mapRef.current.animateCamera({ center: location });
  };

  const moveToCurrentLocation = async () => {
    const location = await getLocation();
    if (!location) return;
    moveCameraToLocation(location);
  };

  // Conectar al servidor y recibir la ubicación en tiempo real
  useEffect(() => {
    socket.on('nueva_ubicacion', (data) => {
      const newLocation = { latitude: data.punto.latitud, longitude: data.punto.longitud };
      console.log('Nueva ubicación:', newLocation);
      
      setRotation(calculateRotation(convoyPosition, newLocation));
      setConvoyPosition(newLocation);

      if (isFollowingConvoy) {
        console.log("Moviendo la cámara a la nueva ubicación del convoy");
        moveCameraToLocation(newLocation);
      }
    });

    return () => {
      socket.off('nueva_ubicacion');
      socket.disconnect();
    };
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
          setIsFollowingConvoy(false);
        }}
        region={{
          latitude: cameraLocation.current.latitude,
          longitude: cameraLocation.current.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        {/* Dibuja la Línea 4 en el mapa */}
        {isShowingPolyline && (
          <Polyline 
            coordinates={LINE_4_ROUTE} 
            strokeColor="#62bbb1" 
            strokeWidth={5} 
          />
        )}

        {/* Marcador para el convoy en tiempo real */}
        <Marker
          key={`${convoyPosition.latitude}-${convoyPosition.longitude}`} // Para forzar el re-renderizado
          coordinate={convoyPosition}
          title="Ubicación del Convoy"
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <Image
            source={require('../../../assets/images/metroimg.png')}
            style={{ 
              width: 80, 
              height: 80, 
              transform: [{ rotate: `${rotation}deg` }]
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
            setIsFollowingConvoy(false);
          }
        }}
        style={{
          bottom: 140,
          right: 20,
        }}
      />

      <FAB
        iconName={isFollowingConvoy ? 'train-outline' : 'skull-outline'}
        onPress={() => {
          setIsFollowingConvoy(!isFollowingConvoy);
          if (!isFollowingConvoy) {
            setIsFollowingUser(false);
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
        onPress={fetchUserData}
        style={{
          top: 10,
          left: 10,
        }}
      />
    </>
  );
};
