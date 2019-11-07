import React from 'react';

import { formatError } from '../utils';

export const SuccessMessage = ({ children }) => (
  <div style={{ color: 'green', marginTop: '0.5rem', fontSize: '0.9rem' }}>{children}</div>
);

export const ErrorMessage = ({ error }) => (
  <div style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>{formatError(error)}</div>
);