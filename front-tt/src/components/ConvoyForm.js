// /components/ConvoyForm.js
import React, { useState, useEffect } from 'react';

const ConvoyForm = ({ selectedConvoy, handleSubmit, handleCancel }) => {
  const [convoyData, setConvoyData] = useState({
    modelo: '',
    status: false,
    id_convoy: ''
  });

  useEffect(() => {
    if (selectedConvoy) {
      setConvoyData(selectedConvoy);
    }else {
      setConvoyData({ id_convoy: '',  modelo: '', status: false,  });
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
        name="id_convoy"
        placeholder="ID Convoy"
        value={convoyData.id_convoy}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="modelo"
        placeholder="Modelo"
        value={convoyData.modelo}
        onChange={handleChange}
        required
      />
      <button type="submit">Guardar Convoy</button>
      <button type="button" onClick={handleCancel}>Cancelar</button>
    </form>
  );
};

export default ConvoyForm;
