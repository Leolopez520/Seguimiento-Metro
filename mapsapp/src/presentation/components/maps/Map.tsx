
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, View } from 'react-native'
import { Platform } from 'react-native';
import { Location } from '../../../infraestructure/interface/location';
import { FAB } from '../ui/FAB';
import { useEffect, useRef, useState } from 'react';
import { useLocationStore } from '../../store/location/useLocationStore';
import { USER } from '../ui/USER';



interface Props {
    showUserLocation?: boolean;
    initialLocation: Location;

}




export const Map = ({ showUserLocation = true, initialLocation }: Props) => {

    const mapRef = useRef<MapView>();

    const cameraLocation = useRef<Location>( initialLocation );

    const [isFollowingUser, setIsFollowingUser] = useState(true);
    const [isShowingPolyline, setIsShowingPolyline] = useState(true);

    const { 
      getLocation, 
      lastKnownLocation, 
      watchLocation, 
      clearWatchLocation, 
      userLocationsList ,
    } = useLocationStore();

    const moveCameraToLocation = ( location: Location ) =>{
      if ( !mapRef.current ) return;

      mapRef.current.animateCamera({ center: location});

    }

    const moveToCurrentLocation = async() => {
      const location = await getLocation();
      if (!location ) return;
      moveCameraToLocation(location); 
    }


    useEffect(() => {
      watchLocation();
    
      return () => {
        clearWatchLocation();
      }
    }, []);


    useEffect(() => {
      if( lastKnownLocation && isFollowingUser ){
        moveCameraToLocation(lastKnownLocation);
      }
    }, [lastKnownLocation, isFollowingUser ])
    
    

    return (
      <>
      <MapView
      ref = { (map) => mapRef.current= map! }
      showsUserLocation={ showUserLocation }
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={{ flex:1 }}
       onTouchStart={ () => setIsFollowingUser( false ) }
       region={{
         latitude: cameraLocation.current.latitude,
         longitude: cameraLocation.current.longitude,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
     >

       {
        isShowingPolyline &&(
          <Polyline 
            coordinates={ userLocationsList }
            strokeColor='black'
            strokeWidth={ 5 }
            />
        )}

     </MapView>

     <FAB 
        iconName={ isShowingPolyline ? 'eye-outline' : 'eye-off-outline' }
        onPress={ () => setIsShowingPolyline( !isShowingPolyline )}
        style={{
            bottom: 140,
            right: 20,


        }}
     />



     <FAB 
        iconName={ isFollowingUser ? 'walk-outline' : 'accessibility-outline' }
        onPress={ () => setIsFollowingUser( !isFollowingUser )}
        style={{
            bottom: 80,
            right: 20,


        }}
     />


      <FAB 
        iconName='compass-outline'
        onPress={ moveToCurrentLocation }
        style={{
            bottom: 20,
            right: 20,


        }}
     />
      


      <USER 
        iconName='person-outline'
        onPress={ moveToCurrentLocation }
        style={{
            top: 10,
            left: 10,
        }}
     />



      </>
    );
};
