import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoginForm from '../components/LoginForm';

const LoginScreen = () => {
  const handleLogin = (email, password) => {
    // Lógica de autenticación
    console.log('Login:', email, password);
    // Temporarily, you can keep the console log and remove navigation
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <LoginForm onLogin={handleLogin} />
      <View style={styles.linksContainer}>
        <Text>Los enlaces adicionales no están disponibles.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  linksContainer: {
    marginTop: 20,
  },
});

export default LoginScreen;
