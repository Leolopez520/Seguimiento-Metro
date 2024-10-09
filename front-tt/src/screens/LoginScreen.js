// src/screens/LoginScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../styles/LoginScreen.css';  // Asegúrate de que el path sea correcto

const LoginScreen = () => {
  const navigate = useNavigate();

  const handleLogin = (email, password) => {
    // Lógica de autenticación
    console.log('Login:', email, password);
    navigate('/home');
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      <LoginForm onLogin={handleLogin} />
      <div className="links-container">
        <a href="/forgot-password" className="link">¿Olvidaste tu contraseña?</a>
        <a href="/signup" className="link">Registrarse</a>
        <a href="/home" className="link">Ver Mapa</a>
        <a href="/admin-map" className="link">Ver Mapa Superusuario</a>
      </div>
    </div>
  );
};

export default LoginScreen;
