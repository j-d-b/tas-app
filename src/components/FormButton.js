import React from 'react';

import './FormButton.scss';

const FormButton = ({ variety, children, ...props }) => {
  const className = `form-button ${variety && `form-button--${variety.toLowerCase()}`}`;

  return <button className={className} {...props}>{children}</button>;
};

export default FormButton;