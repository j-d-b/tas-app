import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

import './User.scss';
import UserDetails from '../components/UserDetails';
import { FormButton } from '../components/Form';
import EditUser from './EditUser';
import ChangeUserEmail from './ChangeUserEmail';
import DeleteUser from './DeleteUser';

const CONFIRM_USER = gql`
  mutation ConfirmUser ($email: String!) {
    confirmUser(input: { email: $email })
  }
`; 

const SEND_VERIFICATION = gql`
  mutation SendVerifyLink ($email: String!) {
    sendVerifyEmailLink(input: { email: $email })
  }
`;

const User = ({ user, exit, onChangesQuery }) => {
  const refetchQueries = [{ query: onChangesQuery }];

  const [selectedAction, selectAction] = useState(null);
  const [confirmUser, confirmUserResults] = useMutation(CONFIRM_USER, { refetchQueries });
  const [sendVerifyLink, sendVerifyLinkResults] = useMutation(SEND_VERIFICATION, { refetchQueries });

  switch (selectedAction) {
    case 'EDIT_USER': 
      return (
        <div>
          <h1 style={{ marginTop: 0, marginBottom: '1rem' }}>User: {user.email}</h1>
          <EditUser
            user={user}
            onCompleted={() => selectAction(null)}
            refetchQueries={refetchQueries}
          />
        </div>
      );
    case 'CHANGE_EMAIL':
      return (
        <ChangeUserEmail
          currEmail={user.email} 
          onCompleted={() => selectAction(null)}
          refetchQueries={refetchQueries}
        />
      );
    case 'DELETE_USER':
      return (
        <DeleteUser
          user={user}
          refetchQueries={refetchQueries}
          onCompleted={exit}
        />
      );
    default: 
      return (
        <div>
          <h1 style={{ marginTop: 0, marginBottom: '1rem' }}>User: {user.email}</h1>
          
          <div style={{ marginBottom: '1rem' }}>
            <UserDetails user={user} />
          </div>

          {!user.confirmed && (
            <FormButton
              type="button"
              style={{ width: '100%', marginBottom: 0, marginTop: 0 }}
              onClick={() => !confirmUserResults.loading && !confirmUserResults.data && confirmUser({ variables: { email: user.email } })}
              disabled={confirmUserResults.loading || confirmUserResults.data}
            >
              {confirmUserResults.loading && 'Sending...'} 
              {confirmUserResults.error && 'Error; Try again?'}
              {confirmUserResults.data && 'Confirmed!'}
              {!confirmUserResults.data && !confirmUserResults.error && !confirmUserResults.loading && 'Confirm User'}
            </FormButton>
          )}

          {!user.emailVerified && (
            <FormButton
              type="button"
              style={{ width: '100%', marginBottom: 0 }}
              onClick={() => !sendVerifyLinkResults.loading && !sendVerifyLinkResults.data && sendVerifyLink({ variables: { email: user.email } })}
              disabled={sendVerifyLinkResults.loading || sendVerifyLinkResults.data}
            >
              {sendVerifyLinkResults.loading && 'Sending...'} 
              {sendVerifyLinkResults.error && 'Error; Try again?'}
              {sendVerifyLinkResults.data && 'Link sent!'}
              {!sendVerifyLinkResults.data && !sendVerifyLinkResults.error && !sendVerifyLinkResults.loading && 'Resend Verification Email'}
            </FormButton>
          )}

          <div className="user-standard-buttons-row">
            <FormButton
              type="button"
              style={{ width: '100%' }}
              onClick={() => selectAction('DELETE_USER')}
              variety="DANGER"
            >Delete</FormButton>

            <FormButton
              type="button"
              style={{ width: '100%' }}
              onClick={() => selectAction('CHANGE_EMAIL')}
            >Change Email</FormButton>

            <FormButton
              type="button"
              style={{ width: '100%' }}
              onClick={() => selectAction('EDIT_USER')}
            >Edit</FormButton>
          </div>
        </div>
      );
  }
};

export default User;