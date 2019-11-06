import React from 'react';

import AdminOnlyConfiguration from './AdminOnlyConfiguration';

const Configuration = () => (
  <div style={{ maxWidth: 500, margin: '2rem' }}>
    <h1>Configuration</h1>
    <AdminOnlyConfiguration />
  </div>
);

export default Configuration;