import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import NoAccess from './NoAccess';

const PrivateRoute = ({ component: Component, redirectTo, requiredUserRole, ...rest }) => {
  const isAuth = rest.auth.isAuthenticated();

  if (!isAuth || !requiredUserRole) {
    return (
      <Route
        {...rest}
        render={props => isAuth ? <Component {...rest} /> : <Redirect to="/login" />}
      />
    );
  }

  return (
    <Route
      {...rest}
      render={props => rest.auth.isAuthorized(rest.requiredRole) ? <Component {...rest} /> : <NoAccess />}
    />
  );
};

export default PrivateRoute;