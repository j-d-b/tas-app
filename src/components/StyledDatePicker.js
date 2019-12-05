import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import './StyledDatePicker.scss';

const StyledDatePicker = ({ children, ...rest }) => (
  <DatePicker
    dateFormat="yyyy-MM-dd, HH:00"
    popperModifiers={{
      flip: {
        enabled: false
      },
      offset: {
        enabled: true,
        offset: '-5px, -7px'
      },
      preventOverflow: {
        enabled: true,
        escapeWithReference: false,
        boundariesElement: 'viewport'
      }
    }}
    {...rest}
  >{children}</DatePicker>
);

export default StyledDatePicker;