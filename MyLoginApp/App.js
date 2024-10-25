import React, { useEffect } from 'react';
import AppNavigator from './services/navigation';  // Asegúrate de que el path sea correcto
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';

export default function App() {
  // Definir el esquema de deep linking
  const prefix = Linking.createURL('/');

  useEffect(() => {
    // Manejar eventos de deep links
    const handleDeepLink = async (event) => {
      const url = event.url;
      const { path, queryParams } = Linking.parse(url);

      console.log('Deep Link URL:', url);
      console.log('Ruta:', path, 'Parámetros:', queryParams);
    };

    // Suscribirse a los eventos de deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      // Limpiar la suscripción cuando el componente se desmonta
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer
      linking={{
        prefixes: [prefix],
        config: {
          screens: {
            Login: 'login',
            ForgotPassword: 'forgot-password',
            Signup: 'signup',
            Home: 'home',
            ResetPassword: {
              path: 'reset/:token',
              parse: {
                token: (token) => `${token}`,
              },
            },
          },
        },
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}
