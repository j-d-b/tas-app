import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';

import FormPage from './FormPage';

const SIGNUP = gql`
  mutation Signup($name: String!, $email: String!, $password: String!, $company: String!) {
    addUser(input: { name: $name, email: $email, password: $password, company: $company }) {
      email
    }
  }
`;

const Signup = () => {
  const [entries, setEntries] = useState({ name: '', email: '', password: '', company: '' });
  const setEntry = (propName, value) => setEntries({ ...entries, [propName]: value });

  const [signup, { data, error, loading }] = useMutation(SIGNUP);

  const inputs = [
    {
      name: 'Full Name',
      type: 'text',
      value: entries.name,
      handleChange: e => setEntry('name', e.target.value),
      isRequired: true
    },
    {
      name: 'Email Address',
      type: 'email',
      value: entries.email,
      handleChange: e => setEntry('email', e.target.value),
      isRequired: true
    },
    {
      name: 'Password',
      type: 'password',
      value: entries.password,
      handleChange: e => setEntry('password', e.target.value),
      isRequired: true
    },
    {
      name: 'Company',
      type: 'text',
      value: entries.company,
      handleChange: e => setEntry('company', e.target.value),
      isRequired: true
    },
  ];

  return (
    <FormPage
      title="Sign Up"
      onSubmit={e => {
        e.preventDefault();
        signup({ variables: { ...entries } });
      }}
      actionName="Sign Up"
      loadingText="Requesting sign up..."
      data={data}
      error={error && error.toString()}
      successMessage={`Sign up success! Confirmation email and next steps have been sent to ${entries.email}`}
      loading={loading}
      inputs={inputs}
    >
      Already a user? <Link className="form-page__after-box-link" to="/login">Log In</Link>
    </FormPage>
  );
};

export default Signup;