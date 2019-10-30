import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import UnauthenticatedFormPage from '../components/UnauthenticatedFormPage';

const SEND_RESET_LINK = gql`
  mutation sendResetPasswordLink($email: String!) {
    sendResetPasswordLink(input: { email: $email })
  }
`;

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');

  const [sendResetLink, { data, error, loading }] = useMutation(SEND_RESET_LINK);

  const inputs = [
    {
      name: 'Email Address',
      type: 'email',
      value: email,
      handleChange: e => setEmail(e.target.value),
      isRequired: true
    }
  ];

  return (
    <UnauthenticatedFormPage
      title="Request Password Reset"
      onSubmit={e => {
        e.preventDefault();
        sendResetLink({ variables: { email } });
      }}
      actionName="Request Reset"
      loadingText="Requesting reset..."
      data={data}
      error={error}
      successMessage={`Instructions for resetting your password have been sent to ${email.toLowerCase()}`}
      loading={loading}
      inputs={inputs}
    />
  );
};

export default RequestPasswordReset;