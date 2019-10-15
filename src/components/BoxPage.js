import React from 'react';
import { Link } from 'react-router-dom';

import './BoxPage.scss';
import logo from '../images/bctc-tas-simple-logo.svg';

const BoxPage = ({ afterBox: AfterBox, children }) => (
  <div className="box-page">
    <Link to="/login" style={{ margin: '2rem 1rem' }}>
      <img className="box-page__logo" src={logo} alt="BCTC TAS"/>
    </Link>
    <div className="box-page__box">{children}</div>
    {AfterBox && (
      <div className="box-page__after-box">
        <AfterBox />
      </div>
    )}
  </div>
);

export default BoxPage;