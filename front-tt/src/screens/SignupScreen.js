// src/screens/SignupScreen.js
import React from 'react';
import SignupForm from '../components/SignupForm';
import '../styles/SignupScreen.css';  // Asegúrate de que el path sea correcto

const SignupScreen = () => {
  return (
    <div className="signup-container">
      <h2 className="signup-title">Registrar Usuario</h2>
      <SignupForm />
    </div>
  );
};

export default SignupScreen;
