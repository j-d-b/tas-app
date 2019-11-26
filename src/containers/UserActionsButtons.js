import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

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

const UserActionsButtons = ({ user, exit, onChangesQuery }) => {
  const refetchQueries = [{ query: onChangesQuery }];

  const [selectedAction, selectAction] = useState(null);
  const [confirmUser, confirmUserResults] = useMutation(CONFIRM_USER, { refetchQueries });
  const [sendVerifyLink, sendVerifyLinkResults] = useMutation(SEND_VERIFICATION, { refetchQueries });

  switch (selectedAction) {
    case 'EDIT_USER': 
      return (
        <EditUser
          user={user}
          onCancel={exit}
          refetchQueries={refetchQueries}
        />
      );
    case 'CHANGE_EMAIL':
      return (
        <ChangeUserEmail
          currEmail={user.email} 
          onCancel={exit}
          refetchQueries={refetchQueries}
        />
      );
    case 'DELETE_USER':
      return (
        <DeleteUser
          user={user}
          refetchQueries={refetchQueries}
          onCancel={exit}
        />
      );
    default: 
      return (
        <div>
          <div>
            <FormButton
              type="button"
              style={{ width: '100%' }}
              onClick={() => selectAction('EDIT_USER')}
            >
              Edit User
            </FormButton>
          </div>

          <div>
            <FormButton
              type="button"
              style={{ width: '100%' }}
              onClick={() => selectAction('CHANGE_EMAIL')}
            >
              Change Email
            </FormButton>
          </div>

          {!user.confirmed && (
            <div>
              <FormButton
                type="button"
                style={{ width: '100%' }}
                onClick={() => !confirmUserResults.loading && !confirmUserResults.data && confirmUser({ variables: { email: user.email } })}
                disabled={confirmUserResults.loading || confirmUserResults.data}
              >
                {confirmUserResults.loading && 'Sending...'} 
                {confirmUserResults.error && 'Error; Try again?'}
                {confirmUserResults.data && 'Confirmed!'}
                {!confirmUserResults.data && !confirmUserResults.error && !confirmUserResults.loading && 'Confirm User'}
              </FormButton>
            </div>
          )}

          {!user.emailVerified && (
            <div>
              <FormButton
                type="button"
                style={{ width: '100%' }}
                onClick={() => !sendVerifyLinkResults.loading && !sendVerifyLinkResults.data && sendVerifyLink({ variables: { email: user.email } })}
                disabled={sendVerifyLinkResults.loading || sendVerifyLinkResults.data}
              >
                {sendVerifyLinkResults.loading && 'Sending...'} 
                {sendVerifyLinkResults.error && 'Error; Try again?'}
                {sendVerifyLinkResults.data && 'Link sent!'}
                {!sendVerifyLinkResults.data && !sendVerifyLinkResults.error && !sendVerifyLinkResults.loading && 'Resend Verification Email'}
              </FormButton>
            </div>
          )}

          <div>
            <FormButton
              type="button"
              style={{ width: '100%' }}
              onClick={() => selectAction('DELETE_USER')}
              variety="DANGER"
            >
              Delete User
            </FormButton>
          </div>
        </div>
      );
  }
};

export default UserActionsButtons;