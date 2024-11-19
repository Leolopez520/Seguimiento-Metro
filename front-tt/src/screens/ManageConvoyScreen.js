import React, { useState, useEffect } from 'react';
import ConvoyTable from '../components/ConvoyTable';
import axios from 'axios';
import '../styles/ManageConvoy.css';

const ManageConvoys = () => {
  const [convoys, setConvoys] = useState([]);
  const [error, setError] = useState('');

  // Cargar los convoyes desde la API al montar el componente
  useEffect(() => {
    const fetchConvoys = async () => {
      try {
        const response = await axios.get('http://20.163.180.10:5000/convoy');
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
    if (!convoy.id_convoy || !convoy.modelo || !convoy.numero_convoy || !convoy.numero_linea) {
      setError('Por favor, completa todos los campos.');
      return;
    }
  
    const convoyData = {
      id_convoy: convoy.id_convoy,
      modelo: convoy.modelo,
      numero_convoy: parseInt(convoy.numero_convoy, 10), // Convertir a número
      numero_linea: parseInt(convoy.numero_linea, 10), // Convertir a número
      estatus: convoy.estatus || false, // Valor por defecto
    };
  
    
    try {
      const response = await axios.post('http://20.163.180.10:5000/convoy', convoyData);
      setConvoys([...convoys, response.data]); // Agregar el convoy devuelto por el servidor
      console.log('Se ha enviado con éxito');
      setError('');
    } catch (error) {
      if (error.response) {
        console.error('Error al agregar convoy (respuesta del servidor):', error.response.data);
        setError(error.response.data.message || 'Error al agregar el convoy');
      } else if (error.request) {
        console.error('Error al agregar convoy (sin respuesta del servidor):', error.request);
        setError('No se recibió respuesta del servidor.');
      } else {
        console.error('Error al agregar convoy:', error.message);
        setError('Error desconocido al agregar el convoy.');
      }
    }
    setConvoys([...convoys, convoy]); // Agregar el nuevo convoy al estado
    setError('');
    console.log('Nuevo convoy agregado:', convoy);
  };
  

  // Función para actualizar un convoy
  const handleUpdate = async (updatedConvoy) => {
    try {
      await axios.put(`http://20.163.180.10:5000/convoy/${updatedConvoy.id_convoy}`, updatedConvoy);
      setConvoys(
        convoys.map((convoy) =>
          convoy.id_convoy === updatedConvoy.id_convoy ? updatedConvoy : convoy
        )
      );
      setError('');
    } catch (error) {
      console.error('Error al actualizar convoy:', error);
      setError('Error al actualizar el convoy');
    }
  };

  // Función para eliminar un convoy
  const handleDelete = async (id_convoy) => {
    try {
      await axios.delete(`http://20.163.180.10:5000/convoy/${id_convoy}`);
      setConvoys(convoys.filter((convoy) => convoy.id_convoy !== id_convoy)); // Eliminamos el convoy del estado
      setError('');
    } catch (error) {
      console.error('Error al eliminar convoy:', error);
      setError('Error al eliminar el convoy');
    }
  };

  // Función para cambiar el estado del convoy (activo/inactivo)
  const handleStatusChange = async (id_convoy) => {
    const convoyToUpdate = convoys.find((convoy) => convoy.id_convoy === id_convoy);
    const updatedStatus = !convoyToUpdate.status;

    try {
      await axios.put(`http://20.163.180.10:5000/convoy/${id_convoy}`, { status: updatedStatus });
      setConvoys(
        convoys.map((convoy) =>
          convoy.id_convoy === id_convoy ? { ...convoy, status: updatedStatus } : convoy
        )
      );
      setError('');
    } catch (error) {
      console.error('Error al actualizar el estado del convoy:', error);
      setError('Error al actualizar el estado del convoy');
    }
  };

  return (
    <div className="manage-convoys-container">
      <h1>Gestionar Convoys</h1>

      {error && <p className="error-message">{error}</p>}

      {/* Tabla de Convoys */}
      <ConvoyTable
        convoys={convoys}
        handleUpdate={handleUpdate} // Actualizar convoy
        handleDelete={handleDelete} // Eliminar convoy
        handleAddConvoy={handleAddConvoy} // Agregar convoy
        handleStatusChange={handleStatusChange} // Cambiar estado de convoy
      />
    </div>
  );
};

export default ManageConvoys;
