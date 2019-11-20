import React, { useEffect } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { applyNewToken } from '../utils';
import BoxPage from '../components/BoxPage';
import FullPageSpinner from '../components/FullPageSpinner';
import { ErrorMessage, SuccessMessage } from '../components/ResponseMessage';

const VERIFY_EMAIL = gql`
  mutation verifyEmail($verifyToken: String!) {
    verifyEmail(input: { verifyToken: $verifyToken })
  }
`;

const VerifyEmailPage = ({ match }) => {
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
        <ErrorMessage error={error} />
        <ErrorMessage>Please contact a system administrator</ErrorMessage>
      </BoxPage>
    );
  }

  if (data) {
    return (
      <BoxPage>
        <div className="form-page__title">Verify Email</div>
        <SuccessMessage>
          <p>Email verification success!</p>
          <p>Logging in...</p>
        </SuccessMessage>
      </BoxPage>
    );
  }

  return <FullPageSpinner />;
};

export default VerifyEmailPage;