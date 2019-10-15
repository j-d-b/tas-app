import React from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { logoutCleanup } from '../utils';
import FullPageSpinner from './FullPageSpinner';

const LOGOUT = gql`
  mutation Logout {
    logout(input: {})
  }
`;

const LogoutButton = ({ className }) => {
  const client = useApolloClient();

  const [logout, { loading }] = useMutation(LOGOUT, { onCompleted: () => logoutCleanup(client) });

  if (loading) return <FullPageSpinner />
  
  return (
    <button
      className={className}
      type="button"
      onClick={logout}
      disabled={loading}
    >
      Log out
    </button>
  );
};

export default LogoutButton;