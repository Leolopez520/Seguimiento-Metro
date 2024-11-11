import React from 'react';
import MapView, { Polyline, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Image, Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Location } from '../../../infraestructure/interface/location';
import { FAB } from '../ui/FAB';
import { USER } from '../ui/USER';
import { useLocationStore } from '../../store/location/useLocationStore';
import { FIXED_ROUTE } from '../../navigation/fixedRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
  const [convoyPosition, setConvoyPosition] = useState<Location>(FIXED_ROUTE[0]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  const { getLocation, lastKnownLocation, watchLocation, clearWatchLocation } = useLocationStore();


  const fetchUserData = async () => {
    try {
      // Obtén el ID del usuario desde AsyncStorage
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

  useEffect(() => {
    const interval = setInterval(() => {
      setRouteIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % FIXED_ROUTE.length;
        const prevPosition = FIXED_ROUTE[prevIndex];
        const nextPosition = FIXED_ROUTE[nextIndex];
        setConvoyPosition(nextPosition);
        const newRotation = calculateRotation(prevPosition, nextPosition);
        setRotation(newRotation);

        if (isFollowingConvoy) {
          moveCameraToLocation(nextPosition);
        }

        return nextIndex;
      });
    }, 5000);

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
          setIsFollowingConvoy(false);
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

        <Marker coordinate={convoyPosition} title="Convoy Simulado" anchor={{ x: 0.5, y: 0.5 }}>
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
        onPress={fetchUserData} // Cambia `moveToCurrentLocation` por `fetchUserData`
        style={{
          top: 10,
          left: 10,
        }}
      />
    </>
  );
};
