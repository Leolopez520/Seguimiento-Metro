import React from 'react';
import PropTypes from 'prop-types'; // Para validación de props
import '../styles/HeaderStyle.css'; // Archivo CSS para estilos
import { Link } from 'react-router-dom'; // Importar Link de react-router-dom


const Header = ({ userPhoto, isSuperUser, onLogout, onViewUserInfo, onManageConvoys }) => {
  return (
    <header className="header-container">
      {/* Botón de información del usuario */}
      <div className="header-left">
        <button className="user-info-button" onClick={onViewUserInfo}>
            Información del usuario
        </button>
      </div>

      {/* Título de la página */}
      <div className="header-center">
        <h1>Ubica Mi Metro</h1>
      </div>

      {/* Botones de la derecha */}
      <div className="header-right">
        {/* Botón de gestionar convoys, visible solo para superusuarios */}
        {isSuperUser && (
          <Link to="/manageconvoy" className="manage-link">
            <button className="manage-convoys-button">Gestionar Convoys</button>
          </Link>
        )}
        {/* Botón de salir */}
        <button className="logout-button" onClick={onLogout}>
          Salir
        </button>
      </div>
    </header>
  );
};

// Validación de las props
Header.propTypes = {
  userPhoto: PropTypes.string.isRequired, // URL de la foto del usuario
  isSuperUser: PropTypes.bool.isRequired, // Indica si es superusuario
  onLogout: PropTypes.func.isRequired, // Función al hacer clic en salir
  onViewUserInfo: PropTypes.func.isRequired, // Función al hacer clic en la foto
  onManageConvoys: PropTypes.func, // Función al hacer clic en gestionar convoys
};

export default Header;