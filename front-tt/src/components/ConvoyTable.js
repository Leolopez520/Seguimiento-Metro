import React, { useState } from 'react';
import ConvoyRow from './ConvoyRow';

const ConvoyTable = ({ convoys, handleUpdate, handleDelete, handleAddConvoy}) => {

  const [newConvoy, setNewConvoy] = useState({
    numero_linea: '',
    numero_convoy: '',
    modelo: '',
    estatus: false,
    id_convoy: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConvoy({
      ...newConvoy,
      [name]: value,
    });
  };

  const handleAddClick = () => {
    handleAddConvoy(newConvoy);
    setNewConvoy({
      numero_linea: '',
      numero_convoy: '',
      modelo: '',
      estatus: false,
      id_convoy: '',
    });
  };

  return (
    <table className="convoy-table">
      <thead>
        <tr>
          <th>N° Convoy</th>
          <th>Modelo</th>
          <th>N° Línea</th>
          <th>Estatus</th>
          <th>ID Convoy</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {convoys.map((convoy) => (
          <ConvoyRow
            key={convoy.id_convoy}
            convoy={convoy}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          />
        ))}
        <tr>
          <td>
            <input
              type="text"
              name="numero_convoy"
              value={newConvoy.numero_convoy}
              onChange={handleInputChange}
            />
          </td>
          <td>
            <input
              type="text"
              name="modelo"
              value={newConvoy.modelo}
              onChange={handleInputChange}
            />
          </td>
          <td>
            <input
              type="text"
              name="numero_linea"
              value={newConvoy.numero_linea}
              onChange={handleInputChange}
            />
          </td>
          <td>
            <input
              type="checkbox"
              name="estatus"
              checked={newConvoy.estatus}
              onChange={(e) =>
                setNewConvoy({ ...newConvoy, estatus: e.target.checked })
              }
            />
          </td>
          <td>
            <input
              type="text"
              name="id_convoy"
              value={newConvoy.id_convoy}
              onChange={handleInputChange}
            />
          </td>
          <td>
            <button onClick={handleAddClick} className="add-btn">
              ➕
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ConvoyTable;