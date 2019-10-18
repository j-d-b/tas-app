import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import './EditUser.scss';
import FormInput from './FormInput';
import FormButton from './FormButton';

const CHANGE_EMAIL = gql`
  mutation ChangeEmail ($currEmail: String!, $newEmail: String!) {
    changeUserEmail(input: { currEmail: $currEmail, newEmail: $newEmail })
  }
`;

const ChangeUserEmail = ({ currEmail, onCancel, refetchQueries }) => {
  const [newEmail, setNewEmail] = useState('');
  const [changeEmail, { error, loading }] = useMutation(
    CHANGE_EMAIL,
    { 
      refetchQueries,
      onCompleted: onCancel
    }
  );

  return (
    <form 
      name="changeUserEmail" 
      onSubmit={e => {
        e.preventDefault();
        changeEmail({ variables: { currEmail, newEmail }});
      }}
    >
      <label className="user-details__label" htmlFor="newEmail">New Email</label>
      <FormInput
        name="newEmail"
        id="newEmail"
        type="email"
        value={newEmail}
        onChange={e => setNewEmail(e.target.value)}
        required
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormButton type="button" style={{ marginRight: '0.3rem' }} onClick={onCancel}>Cancel</FormButton>
        <FormButton type="submit" variety="SUCCESS" disabled={loading}>{loading ? 'Requesting...' : 'Change Email'}</FormButton>
      </div>

      {error && <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error.toString()}</div>}
    </form>
  );
};


export default ChangeUserEmail;