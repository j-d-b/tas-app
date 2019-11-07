import React from 'react';

const RightAlign = ({ direction = 'row', children }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: direction, alignItems: 'flex-end' }}>{children}</div>
);

export default RightAlign;