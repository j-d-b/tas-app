import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';

import FormPage from './FormPage';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password })
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLoginSuccess = ({ login }) => {
    localStorage.setItem('authToken', login);
  };

  const [login, { data, error, loading }] = useMutation(
    LOGIN,
    { 
      onCompleted: onLoginSuccess,
      update: cache => cache.writeData({ data: { isLoggedIn: true }})
    }
  );

  const inputs = [
    {
      name: 'Email Address',
      type: 'email',
      value: email,
      handleChange: e => setEmail(e.target.value),
      isRequired: true
    },
    {
      name: 'Password',
      type: 'password',
      value: password,
      handleChange: e => setPassword(e.target.value),
      isRequired: true
    }
  ];

  return (
    <FormPage
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
    >
      Don't have an account? <Link className="form-page__line-after-link" to="/signup">Sign Up</Link>
    </FormPage>
  );
};

export default Login;