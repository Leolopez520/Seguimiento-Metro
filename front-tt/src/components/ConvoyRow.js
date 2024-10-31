// /components/ConvoyRow.js
import React from 'react';

const ConvoyRow = ({ convoy, handleEdit, handleDelete, handleStatusChange }) => {
  return (
    <tr>
      <td>{convoy.numero_convoy}</td>
      <td>{convoy.modelo}</td>
      <td>
        <span
          className={`status-circle ${convoy.estatus ? 'status-active' : 'status-inactive'}`}
          onClick={() => handleStatusChange(convoy.id_convoy)}
        />
      </td>
      <td>{convoy.id_convoy}</td>
      <td>
        <button onClick={() => handleEdit(convoy)} className="edit-btn">✏️</button>
        <button onClick={() => handleDelete(convoy.id_convoy)} className="delete-btn">🗑️</button>
      </td>
    </tr>
  );
};

export default ConvoyRow;
