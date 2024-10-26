// /screens/ManageConvoys.js
import React, { useState } from 'react';
import ConvoyTable from '../components/ConvoyTable';
import '../styles/ManageConvoy.css';

const ManageConvoys = () => {
  const [convoys, setConvoys] = useState([
    { id: 1, modelo: 'Modelo A', status: true, idGPS: 'GPS123' },
    { id: 2, modelo: 'Modelo B', status: false, idGPS: 'GPS456' },
    { id: 3, modelo: 'Modelo C', status: true, idGPS: 'GPS789' },
  ]);

  const [newConvoy, setNewConvoy] = useState({ id: '', modelo: '', status: true, idGPS: '' });

  // Prototipo de la función para hacer el POST y agregar un convoy
  const handleAddConvoy = () => {
    // Continuar con el post 
    // Simulación de un nuevo convoy
    const newId = convoys.length + 1;
    const updatedConvoys = [...convoys, { ...newConvoy, id: newId }];
    setConvoys(updatedConvoys);

    // Resetear el formulario
    setNewConvoy({ id: '', modelo: '', status: true, idGPS: '' });
  };

  return (
    <div className="manage-convoys-container">
      <h1>Gestionar Convoy</h1>

      {/* Tabla de Convoys */}
      <ConvoyTable
        convoys={convoys}
        handleEdit={(id) => console.log('Edit convoy', id)}
        handleDelete={(id) => console.log('Delete convoy', id)}
        handleStatusChange={(id) => console.log('Status changed for convoy', id)}
      />

      {/* Formulario para agregar convoy */}
      <div className="add-convoy-form">
        <input
          type="text"
          placeholder="Modelo"
          value={newConvoy.modelo}
          onChange={(e) => setNewConvoy({ ...newConvoy, modelo: e.target.value })}
        />
        <input
          type="text"
          placeholder="ID GPS"
          value={newConvoy.idGPS}
          onChange={(e) => setNewConvoy({ ...newConvoy, idGPS: e.target.value })}
        />
        <button onClick={handleAddConvoy}>Guardar Convoy</button>
      </div>

      {/* Botón de "Nuevo Convoy" */}
      <button className="nuevo-convoy-button">Nuevo Convoy</button>
    </div>
  );
};

export default ManageConvoys;
