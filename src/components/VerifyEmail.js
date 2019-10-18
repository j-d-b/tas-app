import React, { useEffect } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import BoxPage from './BoxPage';
import FullPageSpinner from './FullPageSpinner';
import { applyNewToken } from '../utils';

const VERIFY_EMAIL = gql`
  mutation verifyEmail($verifyToken: String!) {
    verifyEmail(input: { verifyToken: $verifyToken })
  }
`;

const VerifyEmail = ({ match }) => {
  const client = useApolloClient();

  const [verifyEmail, { data, error }] = useMutation(
    VERIFY_EMAIL,
    { 
      onCompleted: ({ verifyEmail }) => {
        window.setTimeout(() => {
          applyNewToken(verifyEmail, client);
        }, 3000);
      }
    }
  );

  const { verifyToken } = match.params; // don't have to null check as the router does that

  useEffect(() => {
    verifyEmail({ variables: { verifyToken } });
  }, [verifyEmail, verifyToken]);

  if (error) {
    return (
      <BoxPage>
        <div className="form-page__title">Verify Email</div>
        <div style={{ color: 'red' }}>
          <p>{error.toString()}</p>
          <p>Please contact a system administrator</p>
        </div>
      </BoxPage>
    );
  }

  if (data) {
    return (
      <BoxPage>
        <div className="form-page__title">Verify Email</div>
        <div style={{ color: 'green' }}>
          <p>Email verification success!</p>
          <p>Logging in...</p>
        </div>
      </BoxPage>
    );
  }

  return <FullPageSpinner />;
};

export default VerifyEmail;