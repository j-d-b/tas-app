import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './AuthenticatedApp.scss';
import { meetsRequiredRole } from '../utils';
import Navbar from './Navbar';
import Scheduler from './Scheduler';
import Dashboard from './Dashboard';
import Admin from './Admin';
import Configuration from './Configuration';
import Settings from './Settings';

const ALL_ROUTES = [
  {
    name: 'Scheduler',
    path: '/scheduler',
    component: Scheduler
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
    component: Admin
  },
  {
    name: 'Configuration',
    path: '/configuration',
    requiredRole: 'OPERATOR',
    component: Configuration
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
      
      <div className="page">
        <Switch>
          {routes.map(({ path, component }) => <Route path={path} key={path} component={component} />)}
          <Route path="/">
            <Redirect to={userRole === 'CUSTOMER' ? '/scheduler' : '/dashboard'} />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default AuthenticatedApp;
