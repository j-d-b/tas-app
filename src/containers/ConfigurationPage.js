import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import AdminOnlyConfiguration from './AdminOnlyConfiguration';
import UpcomingRestrictionsTable from './UpcomingRestrictionsTable';
import ManageTemplates from './ManageTemplates';

const USER_STATUS = gql`
  {
    userRole @client
  }
`;

const ConfigurationPage = () => {
  const { data } = useQuery(USER_STATUS);

  return (
    <div style={{ margin: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <h1 style={{ fontSize: '1.6rem', marginTop: 0 }}>Upcoming Gate Capacity Restrictions by Time Slot</h1>
        <div style={{ paddingLeft: '0.25rem', cursor: 'pointer', fontSize: '0.9rem' }}>ⓘ</div>
      </div>

      <UpcomingRestrictionsTable />

      <div style={{ maxWidth: 500 }}>
        <h1 style={{ fontSize: '1.6rem', marginTop: 0 }}>Manage Templates</h1>
        <ManageTemplates />
      </div>

      {data && data.userRole === 'ADMIN' && (
        <div style={{ maxWidth: 500 }}>
          <h1 style={{ fontSize: '1.6rem' }}>System Defaults</h1>
          <AdminOnlyConfiguration />
        </div>
      )}
    </div>
  );
}

export default ConfigurationPage;