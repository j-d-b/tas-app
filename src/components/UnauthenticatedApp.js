import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import LoginPage from '../containers/LoginPage';
import Signup from '../containers/Signup';
import RequestPasswordReset from '../containers/RequestPasswordResetPage';
import ResetPasswordPage from '../containers/ResetPasswordPage';
import VerifyEmailPage from '../containers/VerifyEmailPage';

const UnauthenticatedApp = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={Signup} />
        <Route path="/request-password-reset" component={RequestPasswordReset} />
        <Route path="/reset-password/:resetToken" component={ResetPasswordPage} />
        <Route path="/verify-email/:verifyToken" component={VerifyEmailPage} />
        <Route path="/">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default UnauthenticatedApp;
