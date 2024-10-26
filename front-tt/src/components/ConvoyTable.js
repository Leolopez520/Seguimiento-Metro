// /components/ConvoyTable.js
import React from 'react';
import ConvoyRow from './ConvoyRow';

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
          <ConvoyRow
          key={convoy.id}
          convoy={convoy}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleStatusChange={handleStatusChange}
        />
        ))}
      </tbody>
    </table>
  );
};

export default ConvoyTable;
