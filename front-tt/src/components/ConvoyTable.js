// ConvoyTable.js
import React from 'react';

const ConvoyTable = ({ convoys, handleEdit, handleDelete, handleStatusChange }) => {
  return (
    <table className="convoy-table">
      <thead>
        <tr>
          <th>N° Convoy</th>
          <th>Modelo</th>
          <th>Status</th>
          <th>ID GPS</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {convoys.map((convoy) => (
          <tr key={convoy.id}>
            <td>{convoy.id}</td>
            <td>{convoy.modelo}</td>
            <td>
              <div
                className={`status-circle ${convoy.status ? 'status-active' : 'status-inactive'}`}
                onClick={() => handleStatusChange(convoy.id)}
              ></div>
            </td>
            <td>{convoy.idGPS}</td>
            <td>
              <button onClick={() => handleEdit(convoy.id)}>✏️</button>
              <button onClick={() => handleDelete(convoy.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ConvoyTable;
