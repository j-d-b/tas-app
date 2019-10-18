import React from 'react';

import './FormSelect.scss';

const FormSelect = ({ options, ...rest}) => (
  <select className="form-select" {...rest}>
    {options.map(({ name, value }) => <option key={value} value={value}>{name}</option>)}
  </select>
);

export default FormSelect;