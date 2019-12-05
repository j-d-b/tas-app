import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { FormButton } from '../components/Form';
import { ErrorMessage } from '../components/ResponseMessage';

const DELETE_USER = gql`
  mutation DeleteUser ($email: String!) {
    deleteUser(input: { email: $email })
  }
`;

const DeleteUser = ({ user, onCompleted, refetchQueries }) => {
  const [deleteUser, { loading, error }] = useMutation(
    DELETE_USER,
    { 
      refetchQueries,
      onCompleted
    }
  );

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ marginTop: 0, marginBottom: '1rem' }}>Confirm Deletion</h1>

      <p>Are you sure you wish to delete <strong>{user.email}</strong>?</p>

      <FormButton
        type="button"
        style={{ width: 'calc(50% - 0.25rem)', marginRight: '0.25rem', marginTop: '0.75rem' }}
        onClick={onCompleted}
      >Cancel</FormButton>

      <FormButton
        type="button"
        style={{ width: '50%' }}
        variety="DANGER"
        disabled={loading}
        onClick={() => !loading && deleteUser({ variables: { email: user.email } })}
      >{loading ? 'Requesting...' : 'Delete'}</FormButton>

      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default DeleteUser;