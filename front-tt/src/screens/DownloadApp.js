// /src/screens/DownloadApp.js
import React from 'react';
import DownloadButton from '../components/DownloadButton';
import '../styles/DownloadApp.css';

const DownloadScreen = () => {
  return (
    <div className="download-container">
      <div className="download-card">
        <h2 className="download-title">Descarga de la Aplicación</h2>
        <p className="download-description">Haz clic en el botón de abajo para descargar el archivo APK.</p>
        <DownloadButton url="/app-release.apk" label="Descargar APK" />
      </div>
    </div>
  );
};

export default DownloadScreen;
