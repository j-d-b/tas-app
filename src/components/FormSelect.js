import React from 'react';

import './FormSelect.scss';

const FormSelect = ({ options, name, ...rest}) => (
  <select className="form-select" {...rest}>
    <option value="" hidden></option>
    {options.map(({ name, value }) => <option key={value} value={value}>{name}</option>)}
  </select>
);

export default FormSelect;