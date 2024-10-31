// src/components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Evitar recarga de página
    try {
      const response = await axios.post('http://20.163.180.10:5000/login', {
        correo: correo,
        contraseña: contraseña,
      });

      if (response.data.status === 'success') {
        window.alert(`Bienvenido, ${response.data.usuario.nombre}`);
        navigate('/home');  // Navegar a la pantalla de Home en la web
      } else {
        window.alert('Error: Correo o contraseña incorrectos');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.alert('Error de autenticación: Correo o contraseña incorrectos');
      } else {
        console.error('Error al conectar con la API:', error);
        window.alert('Error de conexión: No se pudo conectar con el servidor');
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <input
        type="email"
        placeholder="Correo electrónico"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        className="login-input"
        required
      />
      <input
        type={showPassword?'text':'password'}
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        className="login-input"
        required
      />
      <div className="password-toggle">
        <input 
          type="checkbox" 
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)} 
        />
        <label>Mostrar Contraseña</label>
      </div>
      <button type="submit" className="login-button">Iniciar sesión</button>

      <button
        type="button"
        className="download-app-button"
        onClick={() => navigate('/downloadapp')}
      >
        Descargar App
      </button>

    </form>
  );
};

export default LoginForm;