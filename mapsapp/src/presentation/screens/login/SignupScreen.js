import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const validarContraseña = (contraseña) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(contraseña);
  };

  const handleSignup = async () => {
    if (!validarContraseña(contraseña)) {
      Alert.alert(
        'Formato de contraseña inválido',
        'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un caracter especial.'
      );
      return;
    }

    try {
      const response = await axios.post('http://20.163.180.10:5000/registro', {
        correo,
        nombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        contraseña,
        tipo_usuario: false
      });

      if (response.data.status === 'success') {
        Alert.alert(
          'Registro exitoso',
          'Usuario registrado correctamente',
          [{ text: 'OK', onPress: () => navigation.navigate('LoginScreen') }]
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
    <View style={styles.screen}>
      {/* Encabezado con gradiente */}
      <LinearGradient colors={['#5948fd', '#00afff', '#23dca0']} style={styles.header}>
        <Text style={styles.headerText}>MapsApp</Text>
      </LinearGradient>

      {/* Tarjeta de registro */}
      <View style={styles.card}>
        <Text style={styles.title}>Registrarse</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#666"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#666"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Primer apellido"
          placeholderTextColor="#666"
          value={primerApellido}
          onChangeText={setPrimerApellido}
        />
        <TextInput
          style={styles.input}
          placeholder="Segundo apellido"
          placeholderTextColor="#666"
          value={segundoApellido}
          onChangeText={setSegundoApellido}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            placeholderTextColor="#666"
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
        <Button title="Registrarse" onPress={handleSignup} />
      </View>
      <Text style={{ textAlign: 'center', marginTop: 135, color: '#919191' }}>TT 2024-B162</Text>
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
    marginTop: -50,
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
  signupButton: {
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 352,
    color: '#919191',
  },
});

export default SignupScreen;
