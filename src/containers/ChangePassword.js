import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

import './Settings.scss';
import { FormInput, FormButton } from '../components/Form';
import { SuccessMessage, ErrorMessage } from '../components/ResponseMessage';


const CHANGE_PASSWORD = gql`
  mutation ChangePassword ($currPassword: String!, $newPassword: String!) {
    changePassword(input: { currPassword: $currPassword, newPassword: $newPassword })
  }
`;

const ChangePassword = ({ onCancel }) => {
  const [input, setInput] = useState({ currPassword: '', newPassword: '', confirmNew: '' });
  const [clientError, setClientError] = useState(null);
  const [changePassword, { data, loading, error }] = useMutation(CHANGE_PASSWORD, { onCompleted: () => setInput({ currPassword: '', newPassword: '', confirmNew: '' }) });

  return (
    <form onSubmit={e => {
      e.preventDefault();

      if (input.confirmNew === input.newPassword) {
        setClientError(null);
        changePassword({ variables: { currPassword: input.currPassword, newPassword: input.newPassword } });
      } else {
        setClientError('New passwords must match');
      }
    }}>
      <label htmlFor="currPassword">Current Password</label>
      <FormInput
        id="currPassword"
        name="currPassword"
        type="password"
        value={input.currPassword}
        onChange={e => setInput({ ...input, currPassword: e.target.value })}
        required
        disableInvalidHighlighting
      />

      <label htmlFor="newPassword">New Password</label>
      <FormInput
        id="newPassword"
        name="newPassword"
        type="password"
        minLength="6"
        value={input.newPassword}
        onChange={e => setInput({ ...input, newPassword: e.target.value })}
        required
        disableInvalidHighlighting
      />

      <label htmlFor="confirmNew">Confirm New Password</label>
      <FormInput
        id="confirmNew"
        name="confirmNew"
        type="password"
        minLength="6"
        value={input.confirmNew}
        onChange={e => setInput({ ...input, confirmNew: e.target.value })}
        required
        disableInvalidHighlighting
      />
      
      <FormButton
        style={{ width: 'calc(50% - 0.25rem)', marginRight: '0.25rem' }}
        type="button"
        onClick={onCancel}
      >Cancel</FormButton>

      <FormButton
        style={{ width: '50%' }}
        type="submit"
        variety="SUCCESS"
        disabled={loading}
      >
        {loading ? 'Requesting...' : 'Change Password'}
      </FormButton>

      <div style={{ textAlign: 'center' }}>
        {error && <ErrorMessage error={error} />}
        {clientError && <ErrorMessage error={clientError} />}
        {data && <SuccessMessage>Password Changed Successfully!</SuccessMessage>}
      </div>
    </form>
  );
};

export default ChangePassword;