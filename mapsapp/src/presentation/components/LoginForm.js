import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginForm = () => {
  const navigation = useNavigation();
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://20.163.180.10:5000/login', {
        correo: correo,
        contraseña: contraseña,
      });

      if (response.data.status === 'success') {
        // Guarda el ID del usuario en AsyncStorage
        await AsyncStorage.setItem('userId', response.data.usuario.id_usuario.toString());
        
        // Navega a la pantalla de carga y luego al mapa
        navigation.navigate('LoadingScreen');
        setTimeout(() => {
          navigation.navigate('MapScreen');
        }, 1000);
      } else {
        Alert.alert('Error', 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert(
          'Error de autenticación', 
          'Correo o contraseña incorrectos', [
            {
              text: 'OK',
              onPress: () => {
                setCorreo('');
                setContraseña('');
              }
            },
          ],
        );
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
        placeholderTextColor="gray"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          placeholderTextColor="gray"
          value={contraseña}
          onChangeText={setContraseña}
          secureTextEntry={!mostrarContraseña}
        />
        <TouchableOpacity
          onPress={() => setMostrarContraseña(!mostrarContraseña)}
          style={styles.eyeButton}
        >
          <Icon
            name={mostrarContraseña ? 'eye-off' : 'eye'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 45,
    borderColor: '#555',
    borderWidth: 1.5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1.5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    height: 45,
    color: 'black',
  },
  eyeButton: {
    padding: 5,
  },
});

export default LoginForm;
