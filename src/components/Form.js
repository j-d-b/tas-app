import React, { useState } from 'react';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import './Form.scss';

export const FormButton = ({ variety, children, className, ...props }) => {
  const classes = `form-button ${variety ? `form-button--${variety.toLowerCase()} ` : ''}${className}`;
  return <button className={classes} {...props}>{children}</button>;
};

export const FormGroup = ({ children }) => <div className="form-group">{children}</div>;

export const FormInput = ({ onChange, disableInvalidHighlighting, ...rest }) => {
  const [touched, setTouched] = useState(false);

  return (
    <input
      className={`form-input${touched ? ' touched' : ''}${disableInvalidHighlighting ? ' disable-invalid-highlighting' : ''}`}
      onChange={e => {
        if (!touched) setTouched(true);
        if (onChange) onChange(e);
      }}
      {...rest}
    />
  );
};

// Note this is styled by `.PhoneInputInput` class, overridden in Form.scss, and thus here for clarity
export const FormPhoneInput = ({ onChange, value, ...rest }) => {
  const [touched, setTouched] = useState(false);

  return (
    <PhoneInput
      className={`${isPossiblePhoneNumber(value) ? '' : 'invalid'}${touched ? ' touched' : ''}`}
      value={value}
      onChange={value => {
        if (!touched) setTouched(true);
        onChange(value);
      }}
      {...rest}
    />
  );
};

export const FormSelect = ({ options, name, value, placeholder, disabled, onChange, disableInvalidHighlighting, ...rest }) => {
  const [touched, setTouched] = useState(false);
  
  return (
    <select
      className={`form-select${touched ? ' touched' : ''}${disableInvalidHighlighting ? ' disable-invalid-highlighting' : ''}`}
      style={{ color: disabled ? 'graytext' : 'black' }}
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
