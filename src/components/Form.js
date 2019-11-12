import React, { useState } from 'react';

import './Form.scss';

export const FormButton = ({ variety, children, className, ...props }) => {
  const classes = `form-button ${variety ? `form-button--${variety.toLowerCase()} ` : ''}${className}`;
  return <button className={classes} {...props}>{children}</button>;
};

export const FormGroup = ({ children }) => <div className="form-group">{children}</div>;

export const FormInput = React.forwardRef(({ onChange, ...rest}, ref) => {
  const [touched, setTouched] = useState(false);

  return (
    <input
      className={`form-input${touched ? ' touched' : ''}`}
      ref={ref}
      onChange={e => {
        if (!touched) setTouched(true);
        if (onChange) onChange(e);
      }}
      {...rest}
    />
  );
});

export const FormSelect = ({ options, name, value, placeholder, disabled, onChange, ...rest}) => {
  const [touched, setTouched] = useState(false);

  return (
    <select
      className="form-select"
      style={{ color: !value ? 'lightgray' : (disabled ? 'graytext' : 'black') }}
      value={value}
      disabled={disabled} {...rest}
      onChange={e => {
        if (!touched) setTouched(true);
        if (onChange) onChange(e);
      }}
    >
      <option value="" hidden>{placeholder}</option>s
      {options.map(({ name, value: val }) => <option key={val} value={val}>{name}</option>)}
    </select>
  );
};

export const FormNote = ({ children }) => <div className="form-note">{children}</div>;
