import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const LoginForm = () => {
  const navigation = useNavigation();
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://20.163.180.10:5000/login', {
        correo: correo,
        contraseña: contraseña,
      });

      if (response.data.status === 'success') {
        Alert.alert('Bienvenido', `Hola, ${response.data.usuario.nombre}`);
        navigation.navigate('Home');  // Navegar a la pantalla de Home
      } else {
        Alert.alert('Error', 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Error de autenticación', 'Correo o contraseña incorrectos');
      } else {
        console.error('Error al conectar con la API:', error);
        Alert.alert('Error de conexión', 'No se pudo conectar con el servidor');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default LoginForm;
