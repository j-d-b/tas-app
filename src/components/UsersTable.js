import React from 'react';

import './UsersTable.scss';

const UsersTable = ({ columns, users, onUserClick }) => (
  <div className="users-table-container">
    <table className="users-table">
      <thead>
        <tr>
          {columns.map(col => <th key={col.field}>{col.title}</th>)}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          users.map(user => (
            <tr key={user.email}>
              {columns.map(({ component: Component, ...col }) => <td key={col.field}>{Component ? <Component user={user} /> : user[col.field]}</td>)}
              <td onClick={e => onUserClick(e, user)}><button className="actions-button">Actions</button></td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

export default UsersTable;
