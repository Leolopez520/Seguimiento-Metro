import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordForm = ({ token, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Expresión regular para validar la contraseña
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar la contraseña con la expresión regular
    if (!regex.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, un número y un carácter especial.');
      return;
    }

    try {
      const response = await axios.post(`http://20.163.180.10:5000/resetear/${token}`, { contraseña: password });
      setSuccess(response.data.message);
      onSuccess(); // Llama a la función para manejar el éxito
    } catch (err) {
      setError('Token inválido o expirado. Por favor intenta de nuevo.');
      console.error('Error al resetear contraseña:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password">Nueva Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <button type="submit">Restablecer Contraseña</button>
    </form>
  );
};

export default ResetPasswordForm;
