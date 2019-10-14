import React from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const LOGOUT = gql`
  mutation Logout {
    logout(input: {})
  }
`;

const LogoutButton = ({ className }) => {
  const client = useApolloClient();

  const onLogoutSuccess = () => {
    localStorage.clear();
    client.resetStore();
  };

  const [logout, { loading }] = useMutation(LOGOUT, { onCompleted: onLogoutSuccess });

  return (
    <button
      className={className}
      type="button"
      onClick={() => !loading && logout()}
      disabled={loading}
    >
      Log out
    </button>
  );
};

export default LogoutButton;