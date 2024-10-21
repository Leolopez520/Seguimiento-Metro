// src/components/SignupForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [contraseña, setContraseña] = useState('');

  // Validar el formato de la contraseña
  const validarContraseña = (contraseña) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(contraseña);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validar el formato de la contraseña
    if (!validarContraseña(contraseña)) {
      alert(
        'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un caracter especial.'
      );
      return;
    }

    try {
      const response = await axios.post('http://20.163.180.10:5000/registro', {
        correo: correo,
        nombre: nombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        contraseña: contraseña,
        tipo_usuario: false
      });

      if (response.data.status === 'success') {
        alert('Usuario registrado correctamente');
        navigate('/login');
      } else {
        alert('Error al registrar el usuario');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('El correo ya está registrado, intenta con otro.');
      } else {
        console.error('Error al conectar con la API:', error);
        alert('Error de conexión: No se pudo conectar con el servidor');
      }
    }
  };

  return (
    <form onSubmit={handleSignup} className="signup-form">
      <input
        type="email"
        placeholder="Correo electrónico"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        className="signup-input"
        required
      />
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="signup-input"
        required
      />
      <input
        type="text"
        placeholder="Primer apellido"
        value={primerApellido}
        onChange={(e) => setPrimerApellido(e.target.value)}
        className="signup-input"
        required
      />
      <input
        type="text"
        placeholder="Segundo apellido"
        value={segundoApellido}
        onChange={(e) => setSegundoApellido(e.target.value)}
        className="signup-input"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        className="signup-input"
        required
      />
      <button type="submit" className="signup-button">Registrarse</button>
    </form>
  );
};

export default SignupForm;