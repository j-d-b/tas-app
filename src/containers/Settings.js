import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import './Settings.scss';
import EditUser from './EditUser';

const USER_DETAILS = gql`
  query UserDetails {
    me {
      name
      email
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

const Settings = () => {
  const { data, loading, error } = useQuery(USER_DETAILS);

  if (loading) return <div className="settings-page">Loading user details...</div>;

  if (error) return <div className="settings-page">An error occurred <pre>{error.toString()}</pre></div>;

  if (data) {
    return (
      <div className="settings-page">
        <h1 style={{ marginTop: '0' }}>{data.me.email}</h1>
        <div style={{ maxWidth: 500 }}>
          <EditUser user={data.me} refetchQueries={[{ query: USER_DETAILS }]} />
        </div>
      </div>
    );
  }

  return <div>Loading</div>;
};

export default Settings;