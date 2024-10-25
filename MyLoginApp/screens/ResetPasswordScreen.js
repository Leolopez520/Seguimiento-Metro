import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const route = useRoute();
  const { token } = route.params || {};  // Capturar el token del deep link

  const handleResetPassword = async () => {
    if (!token) {
      Alert.alert('Error', 'Token no proporcionado.');
      return;
    }

    try {
      const response = await axios.post(`http://20.163.180.10:5000/resetear/${token}`, {
        contraseña: newPassword,
      });
      Alert.alert('Éxito', response.data.message);
    } catch (error) {
      Alert.alert('Error', 'No se pudo restablecer la contraseña. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Nueva Contraseña"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Restablecer Contraseña" onPress={handleResetPassword} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ResetPasswordScreen;
