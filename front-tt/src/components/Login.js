import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'// Archivo de estilos para personalizar

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Lógica de autenticación
    navigate('/home');
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="password-toggle">
          <input 
            type="checkbox" 
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)} 
          />
          <label>Mostrar Contraseña</label>
        </div>
        <button type="submit" className="login-button">LOGIN</button>
      </form>
      <div className="links-container">
        <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
        <div className="nav-links">
          <a href="/signup">Registrarse</a>
          <a href="/home">Ver Mapa</a>
          <a href="/admin-map">Ver Mapa Superusuario</a>
        </div>
      </div>
    </div>
  );
};

export default Login;