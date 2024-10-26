// /components/ConvoyForm.js
import React, { useState, useEffect } from 'react';

const ConvoyForm = ({ selectedConvoy, handleSubmit, handleCancel }) => {
  const [convoyData, setConvoyData] = useState({
    numero: '',
    modelo: '',
    status: true,
    idGPS: ''
  });

  useEffect(() => {
    if (selectedConvoy) {
      setConvoyData(selectedConvoy);
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
    <form onSubmit={handleFormSubmit}>
      <label>
        N° Convoy:
        <input type="text" name="numero" value={convoyData.numero} onChange={handleChange} />
      </label>
      <label>
        Modelo:
        <input type="text" name="modelo" value={convoyData.modelo} onChange={handleChange} />
      </label>
      <label>
        ID GPS:
        <input type="text" name="idGPS" value={convoyData.idGPS} onChange={handleChange} />
      </label>
      <label>
        Status:
        <input
          type="checkbox"
          name="status"
          checked={convoyData.status}
          onChange={() => setConvoyData({ ...convoyData, status: !convoyData.status })}
        />
      </label>
      <button type="submit">Guardar Convoy</button>
      <button type="button" onClick={handleCancel}>Cancelar</button>
    </form>
  );
};

export default ConvoyForm;
