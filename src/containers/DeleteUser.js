import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { FormButton } from '../components/Form';

const DELETE_USER = gql`
  mutation DeleteUser ($email: String!) {
    deleteUser(input: { email: $email })
  }
`;

const DeleteUser = ({ user, onCancel, refetchQueries }) => {
  const [deleteUser, { loading, error }] = useMutation(
    DELETE_USER,
    { 
      refetchQueries,
      onCompleted: onCancel
    }
  );

  return (
    <div>
      <p style={{ textAlign: 'center' }}>Are you sure you wish to delete {user.email}?</p>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormButton type="button" style={{ marginRight: '0.3rem' }} onClick={onCancel}>Cancel</FormButton>
        <FormButton type="button" variety="DANGER" disabled={loading} onClick={() => !loading && deleteUser({ variables: { email: user.email }})}>{loading ? 'Requesting...' : 'Delete'}</FormButton>
      </div>

      {error && <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error.toString()}</div>}
    </div>
  );
};

export default DeleteUser;