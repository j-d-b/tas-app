import React, { useState, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { refreshAuthToken } from '../utils';
import FullPageSpinner from '../components/FullPageSpinner';
import AuthenticatedApp from '../components/AuthenticatedApp';
import UnauthenticatedApp from '../components/UnauthenticatedApp';
// const AuthenticatedApp = React.lazy(() => import('./AuthenticatedApp'));
// const UnauthenticatedApp = React.lazy(() => import('./UnauthenticatedApp'));

const USER_STATUS = gql`
  {
    isLoggedIn @client
    userRole @client
  }
`;

const App = () => {
  const client = useApolloClient();
  const [hasLoginStatus, setHasLoginStatus] = useState(false);

  useEffect(() => {
    refreshAuthToken(client, () => setHasLoginStatus(true));
  }, [client]);

  const { data } = useQuery(USER_STATUS);
  
  return hasLoginStatus
    ? data && data.isLoggedIn ? <AuthenticatedApp userRole={data.userRole} /> : <UnauthenticatedApp />
    : <FullPageSpinner />;
};

export default App;
