// src/screens/LoginScreen.js
import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/LoginScreen.css';  // Asegúrate de que el path sea correcto
import { Link } from 'react-router-dom';  // Importamos Link de react-router-dom

const LoginScreen = () => {
  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      <LoginForm />
      <div className="links-container">
        <Link to="/forgotpassword" className="forgotpassword-link">¿Olvidaste tu contraseña?</Link>
        <Link to="/signup" className="login-link">Registrarse</Link>
        <a href="/home" className="link">Ver Mapa</a>
        <a href="/admin-map" className="link">Ver Mapa Superusuario</a>
      </div>
    </div>
  );
};

export default LoginScreen;
