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
      title: 'Reminder Setting',
      show: user => {
        switch (user.reminderSetting) {
          case 'EMAIL': return 'Email';
          case 'SMS': return 'SMS';
          case 'BOTH': return 'Email & SMS';
          case 'NONE': return 'Notifications Off';
          default: return 'Notifications Off';
        }
      }
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  return data && (
    <div>
      <UsersTable
        columns={columns}
        users={data.users}
        onUserClick={(e, user) => {
          selectUser(user);
          setIsModalOpen(true);
        }}
      />

      <Modal 
        isOpen={isModalOpen}
        onClosed={() => selectUser(null)}
        closeModal={() => setIsModalOpen(false)}
        title="Edit User"
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ marginTop: 0 }}>{selectedUser && selectedUser.name} ({selectedUser && selectedUser.email})</h1>
        </div>

        <UserActionsButtons user={selectedUser} onChangesQuery={ALL_USERS} exit={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default AdminPage;