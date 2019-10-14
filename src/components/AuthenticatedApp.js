import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './Dashboard';
import Me from './Me';
import Navbar from './Navbar';

const NAV_LINKS = [
  { to: '/dashboard', name: 'Dashboard' },
  { to: '/me', name: 'Me' },
];

const AuthenticatedApp = () => (
  <BrowserRouter>
    <Navbar navLinks={NAV_LINKS} />
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/me" component={Me} />
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default AuthenticatedApp;
