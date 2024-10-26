// /screens/ManageConvoys.js
import React, { useState, useEffect} from 'react';
import ConvoyTable from '../components/ConvoyTable';
import ConvoyForm from '../components/ConvoyForm';
import axios from 'axios';
import '../styles/ManageConvoy.css';

const ManageConvoys = () => {
  const [convoys, setConvoys] = useState([]);
  const [selectedConvoy, setSelectedConvoy] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Aquí puedes cargar los convoyes desde tu API al montar el componente
    const fetchConvoys = async () => {
      try {
        const response = await axios.get('http://20.163.180.10:5000/convoys');
        setConvoys(response.data);
      } catch (error) {
        console.error('Error al cargar los convoyes:', error);
      }
    };

    fetchConvoys();
  }, []);
  
  const handleAddConvoy = async (convoy) => {
    if (!convoy.modelo || !convoy.idGPS) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await axios.post('http://20.163.180.10:5000/convoys', convoy);
      setConvoys([...convoys, response.data]);
      setSelectedConvoy(null); // Reseteamos el formulario
      setError('');
    } catch (error) {
      console.error('Error al agregar convoy:', error);
    }
  };

  const handleEdit = (convoy) => {
    setSelectedConvoy(convoy);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://20.163.180.10:5000/convoys/${id}`);
      setConvoys(convoys.filter(convoy => convoy.id !== id));
    } catch (error) {
      console.error('Error al eliminar convoy:', error);
    }
  };

  const handleStatusChange = async (id) => {
    const convoyToUpdate = convoys.find(convoy => convoy.id === id);
    const updatedStatus = !convoyToUpdate.status;

    try {
      await axios.put(`http://20.163.180.10:5000/convoys/${id}`, { status: updatedStatus });
      setConvoys(convoys.map(convoy => (convoy.id === id ? { ...convoy, status: updatedStatus } : convoy)));
    } catch (error) {
      console.error('Error al actualizar el estado del convoy:', error);
    }
  };

  return (
    <div className="manage-convoys-container">
      <h1>Gestionar Convoy</h1>

      {error && <p className="error-message">{error}</p>}
      {/* Tabla de Convoys */}
      <ConvoyTable
        convoys={convoys}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleStatusChange={handleStatusChange}
      />
      <ConvoyForm selectedConvoy={selectedConvoy} handleSubmit={handleAddConvoy} handleCancel={() => setSelectedConvoy(null)} />
    </div>
  );
};

export default ManageConvoys;
