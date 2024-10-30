import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    try {
      const response = await axios.post('http://20.163.180.10:5000/recuperar', {
        correo: email,
      });

      if (response.data.status === 'success') {
        Alert.alert(
          'Éxito',
          'Correo de recuperación enviado a tu email',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={styles.screen}>
      {/* Encabezado con gradiente */}
      <LinearGradient colors={['#5948fd', '#00afff', '#23dca0']} style={styles.header}>
        <Text style={styles.headerText}>MapsApp</Text>
      </LinearGradient>

      {/* Tarjeta de restablecimiento */}
      <View style={styles.card}>
        <Text style={styles.title}>Restablecer Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button title="Enviar correo de restablecimiento" onPress={handleResetPassword} />
      </View>
      <Text style={{ textAlign: 'center', marginTop: 250, color: '#919191' }}>TT 2024-B162</Text>
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
    marginTop: 150,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -150,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#555',
    borderWidth: 1.5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
});

export default ForgotPasswordScreen;
