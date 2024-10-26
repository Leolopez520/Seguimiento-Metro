// /components/ConvoyForm.js
import React, { useState, useEffect } from 'react';

const ConvoyForm = ({ selectedConvoy, handleSubmit, handleCancel }) => {
  const [convoyData, setConvoyData] = useState({
    modelo: '',
    status: true,
    idGPS: ''
  });

  useEffect(() => {
    if (selectedConvoy) {
      setConvoyData(selectedConvoy);
    }else {
      setConvoyData({ modelo: '', status: true, idGPS: '' });
    }
  }, [selectedConvoy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConvoyData({
      ...convoyData,
      [name]: value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(convoyData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="add-convoy-form">
      <input
        type="text"
        name="modelo"
        placeholder="Modelo"
        value={convoyData.modelo}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="idGPS"
        placeholder="ID GPS"
        value={convoyData.idGPS}
        onChange={handleChange}
        required
      />
      <button type="submit">Guardar Convoy</button>
      <button type="button" onClick={handleCancel}>Cancelar</button>
    </form>
  );
};

export default ConvoyForm;
