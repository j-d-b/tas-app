import React from 'react';

import './Form.scss';

export const FormButton = ({ variety, children, ...props }) => {
  const className = `form-button ${variety && `form-button--${variety.toLowerCase()}`}`;
  return <button className={className} {...props}>{children}</button>;
};

export const FormGroup = ({ children }) => <div className="form-group">{children}</div>;

export const FormInput = props => <input className="form-input" {...props} />;

export const FormSelect = ({ options, name, ...rest}) => (
  <select className="form-select" {...rest}>
    <option value="" hidden></option>
    {options.map(({ name, value }) => <option key={value} value={value}>{name}</option>)}
  </select>
);

export const FormNote = ({ children }) => <div className="form-note">{children}</div>;
