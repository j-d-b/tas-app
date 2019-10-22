import React from 'react';

import { getFriendlyActionType, getHourString } from '../utils';
import './Appt.scss';

const getApptDate = appt => {
  const date = new Date(Date.parse(`${appt.timeSlot.date}T${getHourString(appt.timeSlot.hour)}:00Z`));
  return date;
};

const Appt = ({ appt }) => (
  <div>
    <div className="appt">
      <div style={{ marginBottom: '0.5rem'}}>
        <span className="appt__date">{getApptDate(appt).toDateString()}</span>
        <span className="appt__arrival-window"> ({appt.arrivalWindow})</span>
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
          className="action"
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

export default Appt;