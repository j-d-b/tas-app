import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import UserActionsButtons from './UserActionsButtons';
import Modal from '../components/Modal';
import UsersTable from '../components/UsersTable';
import { getFriendlyUserRole } from '../utils';

const ALL_USERS = gql`
  query AllUsers {
    users(input: {}) {
      name
      email
      role
      company
      companyType
      companyRegNumber
      mobileNumber
      confirmed
      emailVerified
      reminderSetting
    }
  }
`;

const AdminPage = () => {
  const { data, loading, error } = useQuery(ALL_USERS);

  const columns = [
    {
      field: 'name',
      title: 'Name',
    },
    {
      field: 'email',
      title: 'Email',
    },
    {
      field: 'role',
      title: 'Role',
      show: user => getFriendlyUserRole(user.role)
    },
    {
      field: 'company',
      title: 'Company'
    },
    {
      field: 'companyType',
      title: 'Company Type'
    },
    {
      field: 'companyRegNumber',
      title: 'Company Reg. Number'
    },
    {
      field: 'mobileNumber',
      title: 'Mobile Number'
    },
    {
      field: 'reminderSetting',
      title: 'Reminder Setting'
    },
    {
      field: 'confirmed',
      title: 'Confirmed',
      show: user => user.confirmed ? '✔' : '✗'
    },
    {
      field: 'emailVerified',
      title: 'Email Verified',
      show: user => user.emailVerified ? '✔' : '✗'
    }
  ];

  const [selectedUser, selectUser] = useState(null);

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  return data && (
    <div>
      <UsersTable columns={columns} users={data.users} onUserClick={(e, user) => selectUser(user)}/>

      <Modal 
        isOpen={selectedUser}
        closeModal={() => selectUser(null)}
        title="Edit User"
      >
        <div style={{ textAlign: 'center' }}>
          <h1>{selectedUser && selectedUser.name} ({selectedUser && selectedUser.email})</h1>
        </div>

        <UserActionsButtons user={selectedUser} onChangesQuery={ALL_USERS} exit={() => selectUser(null)} />
      </Modal>
    </div>
  );
};

export default AdminPage;