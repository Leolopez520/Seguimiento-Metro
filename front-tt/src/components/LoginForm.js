// src/components/LoginForm.js
import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
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
  );
};

export default LoginForm;
