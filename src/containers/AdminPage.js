import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

import './AdminPage.scss';
import User from './User';
import Modal from '../components/Modal';
import UsersTable from '../components/UsersTable';
import { getPrettyUserRole } from '../helpers';

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

const TableTrueFalse = ({ val }) => val === true ? <div className="checkmark checkmark--true">✔</div> : <div className="checkmark checkmark--false">✗</div>;

const AdminPage = () => {
  const { data, loading, error } = useQuery(ALL_USERS);

  const columns = [
    {
      field: 'name',
      title: 'User',
      component: ({ user }) => (
        <>
          <div>{user.name}</div>
          <div>{user.email}</div>
          <div>{formatPhoneNumberIntl(user.mobileNumber)}</div>
        </>
      )
    },
    {
      field: 'company',
      title: 'Company',
      component: ({ user }) => (
        <>
          <div>{user.company}</div>
          <div>{user.companyType}</div>
          <div>{user.companyRegNumber}</div>
        </>
      )
    },
    {
      field: 'role',
      title: 'Role',
      component: ({ user }) => getPrettyUserRole(user.role)
    },
    {
      field: 'reminderSetting',
      title: 'Reminders',
      component: ({ user }) => {
        switch (user.reminderSetting) {
          case 'EMAIL': return 'Email';
          case 'SMS': return 'SMS';
          case 'BOTH': return 'Email & SMS';
          case 'NONE': return 'Off';
          default: return 'Off';
        }
      }
    },
    {
      field: 'confirmed',
      title: 'Confirmed',
      component: ({ user }) => <TableTrueFalse val={user.confirmed} />
    },
    {
      field: 'emailVerified',
      title: 'Email Verified',
      component: ({ user }) => <TableTrueFalse val={user.emailVerified} />
    }
  ];

  const [selectedUserEmail, selectUserEmail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <div className="loading-or-error-page">Loading...</div>;
  if (error) return <div className="loading-or-error-page">An error occurred. Please reload this page.</div>;

  return data && (
    <div className="admin-page">
      <h1 className="admin-page__heading">User Administration</h1>

      <div className="admin-page__users-table">
        <UsersTable
          columns={columns}
          users={data.users}
          onUserClick={(e, user) => {
            selectUserEmail(user.email);
            setIsModalOpen(true);
          }}
        />
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClosed={() => selectUserEmail(null)}
        closeModal={() => setIsModalOpen(false)}
        title="View User"
      >
        <User userEmail={selectedUserEmail} onChangesQuery={ALL_USERS} exit={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default AdminPage;