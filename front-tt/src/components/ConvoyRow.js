import React, { useState } from 'react';

const ConvoyRow = ({ convoy, handleUpdate, handleDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedConvoy, setEditedConvoy] = useState({ ...convoy });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedConvoy({
      ...editedConvoy,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      handleUpdate(editedConvoy);
    }
  };

  return (
    <tr>
      <td>
        <input
          type="text"
          name="numero_convoy"
          value={editedConvoy.numero_convoy}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </td>
      <td>
        <input
          type="text"
          name="modelo"
          value={editedConvoy.modelo}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </td>
      <td>
        <input
          type="text"
          name="numero_linea"
          value={editedConvoy.numero_linea ?? ''}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </td>
      <td>
        <input
          type="checkbox"
          name="estatus"
          checked={editedConvoy.estatus}
          onChange={(e) =>
            setEditedConvoy({ ...editedConvoy, estatus: e.target.checked })
          }
          disabled={!isEditing}
        />
      </td>
      <td>
        <input
          type="text"
          name="id_convoy"
          value={editedConvoy.id_convoy}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </td>
      <td>
        <button onClick={handleEditClick} className="edit-btn">
          {isEditing ? '💾' : '✏️'}
        </button>
        <button
          onClick={() => handleDelete(editedConvoy.id_convoy)}
          className="delete-btn"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};

export default ConvoyRow;