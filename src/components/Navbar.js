import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import AnimateHeight from 'react-animate-height';

import './Navbar.scss';
import LogoutButton from './LogoutButton';
import logo from '../images/bctc-tas-simple-logo.svg';
import { ReactComponent as BarsIcon } from '../images/bars-solid.svg';
 

const Navbar = ({ navLinks }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.setAttribute('class', 'disable-body-scroll');
    } else {
      document.body.removeAttribute('class');
    }
  }, [isMenuOpen]);

  return (
    <div>
      <div className="navbar-container">
        <nav className="navbar">
          <img src={logo} alt="BCTC TAS" className="navbar__logo" />
          {
            navLinks.map(({ path, name }) => (
              <NavLink to={path} key={name} className="navbar__link navbar__link--desktop" activeClassName="navbar__link--active">
                {name}
              </NavLink>
            ))
          }

          <button className={`navbar__menu-button${isMenuOpen ? ' navbar__menu-button--pressed' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <BarsIcon height="1.3rem" />
          </button>

          <LogoutButton className="navbar__logout-button" />
        </nav>
      </div>

      <AnimateHeight height={isMenuOpen ? 'auto' : 0}>
        <div className="navbar-mobile-menu">
          {
            navLinks.map(({ path, name }) => (
              <NavLink to={path} key={name} className="navbar__link navbar__link--mobile" activeClassName="navbar__link--active">
                {name}
              </NavLink>
            ))
          }
          <LogoutButton className="navbar__link navbar__link--mobile navbar__link--mobile--logout-button" />
        </div>
      </AnimateHeight>

      <CSSTransition in={isMenuOpen} classNames="mobile-menu-backdrop" timeout={300} unmountOnExit>
        <div className="mobile-menu-backdrop" onClick={() => setIsMenuOpen(false)}></div>
      </CSSTransition>
    </div>
  );
};

export default Navbar;