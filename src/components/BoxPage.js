import React from 'react';

import './BoxPage.scss';
import logo from '../images/bctc-tas-simple-logo.svg';

const BoxPage = ({ afterBox: AfterBox, children }) => (
  <div className="box-page">
    <img className="box-page__logo" src={logo} alt="BCTC TAS"/>
    <div className="box-page__box">{children}</div>
    {AfterBox && (
      <div className="box-page__after-box">
        <AfterBox />
      </div>
    )}
  </div>
);

export default BoxPage;