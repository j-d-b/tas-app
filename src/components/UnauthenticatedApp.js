import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';
import RequestPasswordReset from './RequestPasswordReset';

const UnauthenticatedApp = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/request-password-reset" component={RequestPasswordReset}/>
        <Route path="/">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default UnauthenticatedApp;
