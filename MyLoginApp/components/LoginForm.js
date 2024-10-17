import React, { useState } from 'react';
import { View, TextInput, Button, Text, Switch, StyleSheet } from 'react-native';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    onLogin(email, password);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
      />
      <View style={styles.passwordToggle}>
        <Switch
          value={showPassword}
          onValueChange={() => setShowPassword(!showPassword)}
        />
        <Text>Mostrar Contraseña</Text>
      </View>
      <Button title="LOGIN" onPress={handleLogin} />
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
  passwordToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default LoginForm;
