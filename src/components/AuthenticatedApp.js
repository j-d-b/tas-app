import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './AuthenticatedApp.scss';
import { meetsRequiredRole } from '../utils';
import Navbar from './Navbar';
import SchedulerPage from '../containers/SchedulerPage';
import Dashboard from '../containers/Dashboard';
import AdminPage from '../containers/AdminPage';
import ConfigurationPage from '../containers/ConfigurationPage';
import Settings from '../containers/Settings';

const ALL_ROUTES = [
  {
    name: 'Scheduler',
    path: '/scheduler',
    component: SchedulerPage
  },
  { 
    name: 'Dashboard',
    path: '/dashboard',
    requiredRole: 'OPERATOR',
    component: Dashboard
  },
  {
    name: 'Admin',
    path: '/admin',
    requiredRole: 'ADMIN',
    component: AdminPage
  },
  {
    name: 'Configuration',
    path: '/configuration',
    requiredRole: 'OPERATOR',
    component: ConfigurationPage
  },
  {
    name: 'Settings',
    path: '/settings',
    component: Settings 
  }
];

const AuthenticatedApp = ({ userRole }) => {
  const routes = ALL_ROUTES.filter(({ requiredRole }) => meetsRequiredRole(userRole, requiredRole));

  return (
    <BrowserRouter>
      <Navbar navLinks={routes} />

      <div className="page-wrapper">
        <div className="page">
          <Switch>
            {routes.map(({ path, component }) => <Route path={path} key={path} component={component} />)}
            <Route path="/">
              <Redirect to={userRole === 'CUSTOMER' ? '/scheduler' : '/dashboard'} />
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default AuthenticatedApp;
