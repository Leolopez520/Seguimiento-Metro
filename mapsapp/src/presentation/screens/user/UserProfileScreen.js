import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const UserProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { usuario } = route.params;

  // Estados para datos del usuario
  const [nombre, setNombre] = useState(usuario.nombre);
  const [correo, setCorreo] = useState(usuario.correo);
  const [primerApellido, setPrimerApellido] = useState(usuario.primer_apellido);
  const [segundoApellido, setSegundoApellido] = useState(usuario.segundo_apellido);
  const [editable, setEditable] = useState(false);

  // Estados para cambio de contraseña
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSaveChanges = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.put(`http://20.163.180.10:5000/actualizar_usuario`, {
        id_usuario: userId,
        nombre,
        correo,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
      });

      if (response.data.status === 'success') {
        Alert.alert("Éxito", "Datos actualizados correctamente");
        setEditable(false);
      } else {
        Alert.alert("Error", "No se pudieron guardar los cambios");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
      Alert.alert("Error", "No se pudo actualizar los datos en el servidor");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "La nueva contraseña y la confirmación no coinciden");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.put(`http://20.163.180.10:5000/cambiar_contraseña`, {
        id_usuario: userId,
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (response.data.status === 'success') {
        Alert.alert("Éxito", "Contraseña actualizada correctamente");
        setShowPasswordFields(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        Alert.alert("Error", response.data.message || "No se pudo actualizar la contraseña");
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      Alert.alert("Error", "No se pudo cambiar la contraseña en el servidor");
    }
  };

  const handleLogout = async () => {
    // Elimina el ID de usuario guardado en AsyncStorage
    await AsyncStorage.removeItem('userId');
    // Navega de vuelta a la pantalla de login
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={['#5948fd', '#00afff', '#23dca0']} style={styles.header}>
        <Text style={styles.headerText}>Perfil de Usuario</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.title}>Información del Usuario</Text>

        {!showPasswordFields && (
          <>
            <TextInput style={styles.input} value={nombre} onChangeText={setNombre} editable={editable} />
            <TextInput style={styles.input} value={segundoApellido} onChangeText={setSegundoApellido} editable={editable} />
            <TextInput style={styles.input} value={primerApellido} onChangeText={setPrimerApellido} editable={editable} />
            <TextInput style={styles.input} value={correo} onChangeText={setCorreo} editable={editable} />
          </>
        )}

        <View style={styles.buttonContainer}>
          {!showPasswordFields && (
            <Button title={editable ? "Guardar" : "Editar"} onPress={() => {
              if (editable) {
                handleSaveChanges();
              } else {
                setEditable(true);
              }
            }} />
          )}
          <View style={styles.spacing} />
          <Button title="Cambiar Contraseña" onPress={() => setShowPasswordFields(!showPasswordFields)} />
        </View>

        {showPasswordFields && (
          <View style={styles.passwordSection}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña Actual"
              placeholderTextColor={'gray'}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Nueva Contraseña"
              placeholderTextColor={'gray'}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Nueva Contraseña"
              placeholderTextColor={'gray'}
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
            <Button title="Guardar Nueva Contraseña" onPress={handleChangePassword} />
          </View>
        )}
      </View>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>CERRAR SESION</Text>
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', marginTop: 220, color: '#919191' }}>TT 2024-B162</Text>
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
    marginTop: -50,
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
    marginTop: -350,
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
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  spacing: {
    width: 10,
  },
  passwordSection: {
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',

  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserProfileScreen;
