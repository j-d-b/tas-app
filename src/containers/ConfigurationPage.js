import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import './ConfigurationPage.scss';
import Modal from '../components/Modal';
import UpcomingRestrictionsTableInfo from '../components/UpcomingRestrictionsTableInfo';
import AdminOnlyConfiguration from './AdminOnlyConfiguration';
import UpcomingRestrictionsTable from './UpcomingRestrictionsTable';
import ManageTemplates from './ManageTemplates';

const USER_STATUS = gql`
  {
    userRole @client
  }
`;

const ConfigurationPage = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { data } = useQuery(USER_STATUS);

  return (
    <div className="configuration-page">
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <h1 style={{ marginTop: 0, marginBottom: '1rem' }}>Upcoming Gate Capacity Restrictions by Time Slot</h1>
        <div style={{ paddingLeft: '0.25rem', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => setIsInfoModalOpen(true)}>ⓘ</div>
      </div>

      <UpcomingRestrictionsTable />

      <div className="configuration-page__lower-line">
        <div>
          <h1 style={{ marginTop: 0 }}>Manage Templates</h1>
          <ManageTemplates />
        </div>

        {data && data.userRole === 'ADMIN' && (
          <div>
            <h1 style={{ marginTop: 0 }}>System Defaults</h1>
            <AdminOnlyConfiguration />
          </div>
        )}
      </div>
      
      <Modal isOpen={isInfoModalOpen} closeModal={() => setIsInfoModalOpen(false)}>
        <UpcomingRestrictionsTableInfo />
      </Modal>
    </div>
  );
};

export default ConfigurationPage;