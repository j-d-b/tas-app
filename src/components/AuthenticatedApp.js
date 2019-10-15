import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { meetsRequiredRole } from '../utils';
import Dashboard from './Dashboard';
import Admin from './Admin';
import Navbar from './Navbar';

const ALL_ROUTES = [
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/admin', name: 'Admin', component: Admin, requiredRole: 'ADMIN' }
];

const AuthenticatedApp = ({ userRole }) => {
  const routes = ALL_ROUTES.filter(({ requiredRole }) => meetsRequiredRole(userRole, requiredRole));

  return (
    <BrowserRouter>
      <Navbar navLinks={routes} />
      <Switch>
        {
          routes.map(({ path, component }) => <Route path={path} key={path} component={component} />)
        }
        <Route path="/">
          <Redirect to={userRole === 'CUSTOMER' ? '/scheduler' : '/dashboard'} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default AuthenticatedApp;
