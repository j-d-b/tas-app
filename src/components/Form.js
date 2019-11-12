import React from 'react';

import './Form.scss';

export const FormButton = ({ variety, children, className, ...props }) => {
  const classes = `form-button ${variety ? `form-button--${variety.toLowerCase()} ` : ''}${className}`;
  return <button className={classes} {...props}>{children}</button>;
};

export const FormGroup = ({ children }) => <div className="form-group">{children}</div>;

export const FormInput = React.forwardRef((props, ref) => <input className="form-input" ref={ref} {...props} />);

export const FormSelect = ({ options, name, value, placeholder, disabled, ...rest}) => (
  <select className="form-select" style={{ color: !value ? 'lightgray' : (disabled ? 'graytext' : 'black') }} value={value} disabled={disabled} {...rest}>
    <option value="" hidden>{placeholder}</option>
    {options.map(({ name, value: val }) => <option key={val} value={val}>{name}</option>)}
  </select>
);

export const FormNote = ({ children }) => <div className="form-note">{children}</div>;
