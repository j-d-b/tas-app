import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import './Settings.scss';
import EditUser from './EditUser';
import ChangePassword from './ChangePassword';
import { FormButton } from '../components/Form';

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
  const [isChangePassword, setIsChangePassword] = useState(false);
  const { data, loading, error } = useQuery(USER_DETAILS);

  if (loading) return <div className="settings-page">Loading user details...</div>;

  if (error) return <div className="settings-page">An error occurred <pre>{error.toString()}</pre></div>;

  if (data) {
    return (
      <div className="settings-page">
        <div className="settings-page__user-card">
          <h1 className="settings-page__user-card__header">{data.me.email}</h1>
          {isChangePassword
            ? <ChangePassword onCancel={() => setIsChangePassword(false)} />
            : (
              <div>
                <EditUser user={data.me} refetchQueries={[{ query: USER_DETAILS }]} />
                <div style={{ height: 0, width: '100%', borderTop: '1px solid #ccc', margin: '0.5rem 0' }}></div>
                <FormButton style={{ width: '100%' }} type="button" onClick={() => setIsChangePassword(true)}>Change Password</FormButton>
              </div>
            )
          }
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default Settings;