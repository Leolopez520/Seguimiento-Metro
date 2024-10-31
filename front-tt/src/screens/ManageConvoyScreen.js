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

  // Cargar los convoyes desde la API al montar el componente
  useEffect(() => {
    const fetchConvoys = async () => {
      try {
        const response = await axios.get('http://20.163.180.10:5000/convoys');
        setConvoys(response.data.convoys); // Acceder a la propiedad `convoys` de la respuesta
      } catch (error) {
        console.error('Error al cargar los convoyes:', error);
        setError('Error al cargar los convoyes');
      }
    };

    fetchConvoys();
  }, []);
  
  // Función para agregar un convoy
  const handleAddConvoy = async (convoy) => {
    if (!convoy.id_convoy || !convoy.modelo || !convoy.numero_linea || !convoy.numero_convoy) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      await axios.post('http://20.163.180.10:5000/convoy', convoy);      setConvoys([...convoys, convoy]);
      setSelectedConvoy(null); // Reseteamos el formulario
      setError('');
    } catch (error) {
      console.error('Error al agregar convoy:', error);
      setError('Error al agregar el convoy');
    }
  };

  // Función para seleccionar un convoy y editarlo
  const handleEdit = (convoy) => {
    setSelectedConvoy(convoy);
  };

  // Función para eliminar un convoy
  const handleDelete = async (id_convoy) => {
    try {
      await axios.delete(`http://20.163.180.10:5000/convoys/${id_convoy}`);
      setConvoys(convoys.filter(convoy => convoy.id_convoy !== id_convoy)); // Eliminamos el convoy del estado
    } catch (error) {
      console.error('Error al eliminar convoy:', error);
      setError('Error al eliminar el convoy');
    }
  };

  // Función para cambiar el estado del convoy (activo/inactivo)
  const handleStatusChange = async (id_convoy) => {
    const convoyToUpdate = convoys.find(convoy => convoy.id_convoy === id_convoy);
    const updatedStatus = !convoyToUpdate.status;

    try {
      await axios.put(`http://20.163.180.10:5000/convoys/${id_convoy}`, { status: updatedStatus });
      setConvoys(convoys.map(convoy => (convoy.id_convoy === id_convoy ? { ...convoy, status: updatedStatus } : convoy)));
    } catch (error) {
      console.error('Error al actualizar el estado del convoy:', error);
      setError('Error al actualizar el estado del convoy');
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
      <ConvoyForm selectedConvoy={selectedConvoy} 
      handleSubmit={handleAddConvoy} 
      handleCancel={() => setSelectedConvoy(null)} />
    </div>
  );
};

export default ManageConvoys;
