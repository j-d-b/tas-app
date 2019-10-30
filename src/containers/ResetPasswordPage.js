import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';

import { isPassedExpiration } from '../utils';
import UnauthenticatedFormPage from '../components/UnauthenticatedFormPage';

const RESET_PASSWORD = gql`
  mutation resetPassword($newPassword: String!, $resetToken: String!) {
    resetPassword(input: { newPassword: $newPassword, resetToken: $resetToken })
  }
`;

const ResetPasswordPage = ({ match }) => {  
  const { resetToken } = match.params; // don't have to null check as the router does that

  let currentUser;
  try {
    const { userEmail, exp } = jwtDecode(resetToken);
    if (isPassedExpiration(exp)) {
      throw new Error('Token Expired');
    }
    
    currentUser = userEmail;
  } catch (err) {
    throw new Error('Invalid Token');
  }

  const [newPassword, setNewPassword] = useState('');

  const [resetPassword, { data, loading, error }] = useMutation(RESET_PASSWORD);
 
  const inputs = [
    {
      name: 'New Password',
      type: 'password',
      value: newPassword,
      handleChange: e => setNewPassword(e.target.value),
      isRequired: true
    }
  ];

  return (
    <UnauthenticatedFormPage 
      title="Reset Password"
      onSubmit={e => {
        e.preventDefault();
        resetPassword({ variables: { resetToken, newPassword  } });
      }}
      actionName="Reset Password"
      loadingText="Resetting password..."
      data={data}
      error={error}
      successComponent={() => (
        <div>
          <div style={{ color: 'green' }}>Password for {currentUser} reset successfully.</div>
          <div style={{ marginTop: '0.75rem' }}><Link to="/login">Log in here</Link></div>
        </div>
      )}
      loading={loading}
      inputs={inputs}
    />
  );
};

export default ResetPasswordPage;