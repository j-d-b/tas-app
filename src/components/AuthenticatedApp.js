import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import Me from './Me';
import Navbar from './Navbar';

const NAV_LINKS = [
  { to: '/dashboard', name: 'Dashboard' },
  { to: '/me', name: 'Me' },
];

const AuthenticatedApp = () => (
  <div>
    <Navbar navLinks={NAV_LINKS} />
    <Switch>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/me">
        <Me />
      </Route>
      <Route path="/">
        <Dashboard />
      </Route>
    </Switch>
  </div>
);

export default AuthenticatedApp;
