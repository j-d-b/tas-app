import React, { useState } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';

import UnauthenticatedFormPage from '../components/UnauthenticatedFormPage';
import { applyNewToken } from '../utils';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password })
  }
`;

const LoginPage = () => {
  const client = useApolloClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { data, error, loading }] = useMutation(
    LOGIN, 
    { 
      onCompleted: ({ login }) => applyNewToken(login, client) 
    }
  );

  const inputs = [
    {
      name: 'Email Address',
      type: 'text',
      disableInvalidHighlighting: true,
      value: email,
      handleChange: e => setEmail(e.target.value),
      isRequired: true
    },
    {
      name: 'Password',
      type: 'password',
      disableInvalidHighlighting: true,
      value: password,
      handleChange: e => setPassword(e.target.value),
      isRequired: true
    }
  ];

  return (
    <UnauthenticatedFormPage
      title="Log In"
      onSubmit={e => {
        e.preventDefault();
        login({ variables: { email, password } });
      }}
      actionName="Log In"
      loadingText="Logging in..."
      data={data}
      error={error}
      loading={loading}
      inputs={inputs}
      belowForm={() => (
        <div>
          <div style={{ marginBottom: '0.3rem' }}>Forgot your password? <Link className="box-page__after-box__link" to="/request-password-reset">Request Reset</Link></div>
          <div>Don't have an account? <Link className="box-page__after-box__link" to="/signup">Sign Up</Link></div>
        </div>
      )}
    />
  );
};

export default LoginPage;