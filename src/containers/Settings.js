import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

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

  if (loading) return <div style={{ margin: '2rem' }}>Loading user details...</div>;

  if (error) return <div style={{ margin: '2rem' }}>An error occurred <pre>{error.toString()}</pre></div>;

  if (data) {
    return (
      <div>
        <h1 style={{ margin: '2rem 0 0 2rem' }}>{data.me.email}</h1>
        <div style={{ maxWidth: 500, margin: '1rem 2rem 1rem 2rem' }}>
          <EditUser user={data.me} refetchQueries={[{ query: USER_DETAILS }]} />
        </div>
      </div>
    );
  }

  return <div>Loading</div>;
};

export default Settings;