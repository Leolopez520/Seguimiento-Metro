import { useEffect } from 'react';
// Define RootStackParamList if it doesn't exist
type RootStackParamList = {
  LoginScreen: undefined;
  // Add other screens here
};
import { StackNavigationProp } from '@react-navigation/stack';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../../config/theme/styles';
import { usePermissionStore } from '../../store/permissions/usePermissionStore';

export const PermissionScreen = () => {
  const { locationStatus, requestLocationPermission } = usePermissionStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Si el usuario no está logueado, redirigir a la pantalla de login
    const userLoggedIn = false; // Reemplaza esta lógica con la verificación real
    if (!userLoggedIn) {
      navigation.navigate('LoginScreen');
    }
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Habilitar ubicación</Text>

      <Pressable
        style={globalStyles.btnPrimary}
        onPress={requestLocationPermission}
      >
        <Text style={{ color: 'white' }}>Habilitar Localización</Text>
      </Pressable>

      <Text>Estado actual: {locationStatus}</Text>
    </View>
  );
};
