import React from 'react';

import './ResponseMessage.scss';
import { formatError } from '../utils';

export const SuccessMessage = ({ children }) => (
  <div style={{ color: 'green', marginTop: '0.5rem', fontSize: '0.9rem' }}>{children || 'Saved successfully'}</div>
);

export const ErrorMessage = ({ error, children }) => {
  if (error) return <div style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>{formatError(error)}</div>
  return <div style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>{children}</div>
};