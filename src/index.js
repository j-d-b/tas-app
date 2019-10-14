import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import './index.css';
import { setAuthToken } from './utils';
import { resolvers, typeDefs } from './resolvers';
import App from './components/App';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
  typeDefs,
  resolvers,
  request: operation => {
    const authToken = localStorage.getItem('authToken');
    operation.setContext({
      headers: {
        authorization: authToken ? `Bearer ${authToken}` : ''
      }
    });
  },
  onError: ({ graphQLErrors }) => {
    if (graphQLErrors[0].message === 'The authentication token included in the request has expired') {
      setAuthToken(client); // use refresh token to request a new auth token
    } else if (graphQLErrors[0].message === 'You must be authenticated to perform this action') {
      client.resetStore(); // update isLoggedIn status
    }
  }
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>, 
  document.getElementById('root')
);