import React, { useState, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { refreshAuthToken } from '../utils';
import FullPageSpinner from './FullPageSpinner';
import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';
// const AuthenticatedApp = React.lazy(() => import('./AuthenticatedApp'));
// const UnauthenticatedApp = React.lazy(() => import('./UnauthenticatedApp'));

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const App = () => {
  const client = useApolloClient();
  const [hasLoginStatus, setHasLoginStatus] = useState(false);

  useEffect(() => {
    refreshAuthToken(client, () => setHasLoginStatus(true));
  }, [client]);

  const { data } = useQuery(IS_LOGGED_IN);
  
  return hasLoginStatus
    ? data && data.isLoggedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />
    : <FullPageSpinner />;
};

export default App;
