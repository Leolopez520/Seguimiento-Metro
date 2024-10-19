import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [contraseña, setContraseña] = useState('');

  // Función para validar el formato de la contraseña
  const validarContraseña = (contraseña) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(contraseña);
  };

  const handleSignup = async () => {
    // Validar el formato de la contraseña
    if (!validarContraseña(contraseña)) {
      Alert.alert(
        'Formato de contraseña inválido',
        'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un caracter especial.'
      );
      return;
    }

    try {
      const response = await axios.post('http://20.163.180.10:5000/registro', {
        correo: correo,
        nombre: nombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        contraseña: contraseña,
        tipo_usuario: false
      });

      if (response.data.status === 'success') {
        Alert.alert(
          'Registro exitoso',
          'Usuario registrado correctamente',
          [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
          ]
        );
      } 
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Alert.alert('Error', 'El correo ya está registrado, intenta con otro.');
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
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Primer apellido"
        value={primerApellido}
        onChangeText={setPrimerApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Segundo apellido"
        value={segundoApellido}
        onChangeText={setSegundoApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
      />
      <Button title="Registrarse" onPress={handleSignup} />
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

export default SignupScreen;
