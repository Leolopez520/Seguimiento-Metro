import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Asegúrate de tener instalada esta librería
import { useNavigation } from '@react-navigation/native';
import LoginForm from '../../components/LoginForm';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleLogin = (email, password) => {
    console.log('Login:', email, password);
  };

  return (
    <View style={styles.screen}>
      {/* Encabezado con gradiente */}
      <LinearGradient colors={['#5948fd', '#00afff', '#23dca0']} style={styles.header}>
        <Text style={styles.headerText}>MapsApp</Text>
      </LinearGradient>

      {/* Tarjeta de login */}
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <LoginForm onLogin={handleLogin} />
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
            <Text style={styles.link}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ textAlign: 'center', marginTop: 180, color: '#919191' }}>TT 2024-B162</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -50
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -250,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#007fe3',
    fontSize: 14,
    marginVertical: 5,
    fontWeight: '500',
  },
});

export default LoginScreen;
