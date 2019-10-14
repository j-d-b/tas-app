import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './Login';

const UnauthenticatedApp = () => (
  <Switch>
    <Route path="/">
      <Login />
    </Route>
  </Switch>
);

export default UnauthenticatedApp;
