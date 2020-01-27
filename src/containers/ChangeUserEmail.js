import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { FormInput, FormButton } from '../components/Form';
import RightAlign from '../components/RightAlign';
import { ErrorMessage } from '../components/ResponseMessage';

const CHANGE_EMAIL = gql`
  mutation ChangeEmail ($currEmail: String!, $newEmail: String!) {
    changeUserEmail(input: { currEmail: $currEmail, newEmail: $newEmail })
  }
`;

const ChangeUserEmail = ({ currEmail, onCompleted, onChangesQuery, userQuery }) => {
  const [newEmail, setNewEmail] = useState('');
  const [changeEmail, { error, loading }] = useMutation(
    CHANGE_EMAIL,
    { 
      refetchQueries: [{ query: onChangesQuery }, { query: userQuery, variables: { email: newEmail } }],
      onCompleted
    }
  );

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: 0, marginBottom: '1rem' }}>Change User Email</h1>

      <form 
        name="changeUserEmail" 
        onSubmit={e => {
          e.preventDefault();
          changeEmail({ variables: { currEmail, newEmail } });
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

        <FormButton
          type="button"
          style={{ width: 'calc(50% - 0.25rem)', marginRight: '0.25rem', marginTop: '0.75rem' }}
          onClick={onCompleted}
        >Cancel</FormButton>

        <FormButton
          type="submit"
          style={{ width: '50%' }}
          variety="SUCCESS"
          disabled={loading}
        >{loading ? 'Requesting...' : 'Change Email'}</FormButton>

        <RightAlign>
          {error && <ErrorMessage error={error} />}
        </RightAlign>
      </form>
    </div>
  );
};


export default ChangeUserEmail;