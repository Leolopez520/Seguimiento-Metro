// /components/ConvoyRow.js
import React from 'react';

const ConvoyRow = ({ convoy, handleEdit, handleDelete, handleStatusChange }) => {
  return (
    <tr>
      <td>{convoy.numero}</td>
      <td>{convoy.modelo}</td>
      <td>
        <span
          className={`status-circle ${convoy.status ? 'active' : 'inactive'}`}
          onClick={() => handleStatusChange(convoy.id)}
        />
      </td>
      <td>{convoy.idGPS}</td>
      <td>
        <button onClick={() => handleEdit(convoy.id)} className="edit-btn">✏️</button>
        <button onClick={() => handleDelete(convoy.id)} className="delete-btn">🗑️</button>
      </td>
    </tr>
  );
};

export default ConvoyRow;
