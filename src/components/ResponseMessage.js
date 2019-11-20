import React from 'react';

import './ResponseMessage.scss';
import { formatError } from '../utils';

export const SuccessMessage = ({ children }) => (
  <div className="success-message">{children || 'Saved successfully'}</div>
);

export const ErrorMessage = ({ error, children }) => (
  <div className="error-message">{error ? formatError(error) : children}</div>
);