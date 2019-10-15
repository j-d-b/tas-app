import React from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.scss';
import LogoutButton from './LogoutButton';
import logo from '../images/bctc-tas-simple-logo.svg';

const Navbar = ({ navLinks }) => (
  <nav className="navbar">
    <img src={logo} alt="BCTC TAS" className="navbar__logo" />
    {
      navLinks.map(({ path, name }) => (
        <NavLink to={path} key={name} className="navbar__link" activeClassName="navbar__link--active">
          {name}
        </NavLink>
      ))
    }
    <LogoutButton className="navbar__logout-button" />
  </nav>
);

export default Navbar;