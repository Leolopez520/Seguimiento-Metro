// /src/components/DownloadButton.js
import React from 'react';
import '../styles/DownloadButton.css';

const DownloadButton = ({ url, label }) => {
  return (
    <a href={url} download className="download-button">
      {label}
    </a>
  );
};

export default DownloadButton;
