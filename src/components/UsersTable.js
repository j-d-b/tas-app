import React from 'react';

import './UsersTable.scss';

const UsersTable = ({ columns, users, onUserClick }) => (
  <div className="users-table-wrapper">
    <table className="users-table">
      <thead>
        <tr>
          {columns.map(col => <th key={col.field}>{col.title}</th>)}
        </tr>
      </thead>
      <tbody>
        {
          users.map(user => (
            <tr key={user.email} onClick={e => onUserClick(e, user)}>
              {columns.map(col => <td key={col.field}>{col.show ? col.show(user) : user[col.field]}</td>)}
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

export default UsersTable;
