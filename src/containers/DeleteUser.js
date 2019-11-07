import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { FormButton } from '../components/Form';
import RightAlign from '../components/RightAlign';
import { ErrorMessage } from '../components/ResponseMessage';

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

      <RightAlign>
        {error && <ErrorMessage error={error} />}
      </RightAlign>
    </div>
  );
};

export default DeleteUser;