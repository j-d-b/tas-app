import React from 'react';

import AdminOnlyConfiguration from './AdminOnlyConfiguration';
import UpcomingRestrictionsTable from './UpcomingRestrictionsTable';
import ManageTemplates from './ManageTemplates';

const ConfigurationPage = () => {
  return (
    <div style={{ margin: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <h1 style={{ fontSize: '1.6rem', marginTop: 0 }}>Upcoming Gate Capacity Restrictions by Time Slot</h1>
        <div style={{ paddingLeft: '0.25rem', cursor: 'pointer', fontSize: '0.9rem' }}>ⓘ</div>
      </div>

      <UpcomingRestrictionsTable />

      <div style={{ maxWidth: 500 }}>
        <ManageTemplates />
      </div>

      <div style={{ maxWidth: 500 }}>
        <h1 style={{ fontSize: '1.6rem' }}>System Defaults</h1>
        <AdminOnlyConfiguration />
      </div>
    </div>
  );
}

export default ConfigurationPage;