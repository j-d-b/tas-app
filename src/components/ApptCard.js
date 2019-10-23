import React from 'react';

import { getFriendlyActionType, getApptDate } from '../utils';
import './ApptCard.scss';

const ApptCard = ({ appt, onClick }) => (
  <div>
    <div className="appt-card" onClick={onClick}>
      <div style={{ marginBottom: '0.5rem'}}>
        <span className="appt-card__date">{getApptDate(appt).toDateString()}</span>
        <span className="appt-card__arrival-window"> ({appt.arrivalWindow})</span>
      </div>

      <div>
        <span style={{ minWidth: '20%', fontWeight: 'bold', display: 'inline-block' }}>Appt ID: </span>
        <span>{appt.id}</span>
      </div>

      <div>
        <span style={{ minWidth: '20%', fontWeight: 'bold', display: 'inline-block' }}>Customer: </span>
        <span>{appt.user.name}</span>
      </div>

      <div>
        <span style={{ minWidth: '20%', fontWeight: 'bold', display: 'inline-block' }}>Company: </span>
        <span>{appt.user.company}</span>
      </div>
    </div>
    {
      appt.actions.map((action, i) => (
        <div
          className="action-card"
          key={action.containerId || i}
          style={{ 
            top: `-${(i + 1) * 1.5}rem`, 
            zIndex: `-${i + 1}`
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{getFriendlyActionType(action.type)}</div>
          <div><strong>CID: </strong>{action.containerId ? action.containerId.toUpperCase() : 'N/A'}</div>
        </div>
      ))
    }
  </div>
);

export default ApptCard;