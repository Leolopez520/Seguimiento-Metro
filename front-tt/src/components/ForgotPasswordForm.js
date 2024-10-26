//components/ForgotPasswordForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ForgotPassword.css'

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

    try {
      // Enviar solicitud al servidor para restablecer la contraseña
      const response = await axios.post('http://20.163.180.10:5000/recuperar', {
        correo: email,
      });

      // Manejar la respuesta del servidor
      if (response.data.status === 'success') {
        alert('Éxito: Correo de recuperación enviado a tu email');
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      alert('Error de conexión: No se pudo conectar con el servidor');
    }
  };

  return (
    <form className="forgot-password-form" onSubmit={handleResetPassword}>
      <h2 className="title">Restablecer Contraseña</h2>
      <input
        type="email"
        className="input"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="forgotpassword-button">Enviar correo de restablecimiento</button>
    </form>
  );
};

export default ForgotPasswordForm;
