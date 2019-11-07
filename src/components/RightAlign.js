import React from 'react';

const RightAlign = ({ direction = 'row', children }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: direction }}>{children}</div>
);

export default RightAlign;