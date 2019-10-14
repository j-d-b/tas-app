import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import jwtDecode from 'jwt-decode';

import './index.css';
import { refreshAuthToken, logoutCleanup } from './utils';
import { resolvers, typeDefs } from './resolvers';
import App from './components/App';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
  typeDefs,
  resolvers,
  request: operation => {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      let expiration;

      try {
        const { exp } = jwtDecode(authToken);
        expiration = exp;
      } catch (err) {
        return logoutCleanup(client);
      }

      const now = Math.ceil(Date.now() / 1000);
      
      if (now > expiration) {
        return refreshAuthToken(client, newToken => {
          operation.setContext({
            headers: {
              authorization: `Bearer ${newToken}`
            }
          });
        });
      }
  
      operation.setContext({
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });
    }
  },
  onError: ({ graphQLErrors }) => {
    if (graphQLErrors && graphQLErrors.length) {
      if (graphQLErrors[0].message === 'You must be authenticated to perform this action') {
        logoutCleanup(client);
      }
    }
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);