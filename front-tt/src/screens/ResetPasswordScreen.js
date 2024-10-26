import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ResetPasswordForm from '../components/ResetPasswordForm';
import '../styles/ResetPassword.css'

const ResetPasswordScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate(); 
  
  const handleSuccess = () => {
    // Redirigir al login después de un breve retraso
    setTimeout(() => navigate('/login'), 3000); 
  };

  return (
    <div className="reset-password-container">
      <h2>Restablecer Contraseña</h2>
      <ResetPasswordForm token={token} onSuccess={handleSuccess} />
    </div>
  );
};

export default ResetPasswordScreen;
