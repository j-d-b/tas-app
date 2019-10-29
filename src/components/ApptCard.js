import React from 'react';

import { getFriendlyActionType, getApptDate } from '../utils';
import './ApptCard.scss';

const ApptCard = ({ appt, onClick, isCustomer }) => (
  <div>
    <div className="appt-card" onClick={onClick}>
      <div style={{ marginBottom: '0.5rem'}}>
        <span className="appt-card__date">{getApptDate(appt).toDateString()}</span>
        {!isCustomer && <span className="appt-card__arrival-window"> ({appt.arrivalWindow})</span>}
      </div>

      {isCustomer && (
        <>
        <div>
          <span style={{ minWidth: '20%', fontWeight: 'bold', display: 'inline-block' }}>Arrive at: </span>
          <span>{appt.arrivalWindow}</span>
        </div>

        <div>
          <span style={{ minWidth: '20%', fontWeight: 'bold', display: 'inline-block' }}>Actions: </span>
          <span>{appt.actions.map((action, i) => getFriendlyActionType(action.type, isCustomer ? 'CUSTOMER' : 'OPERATOR') + (i + 1 < appt.actions.length ? ', ' : ''))}</span>
        </div>
        </>
      )}

      {!isCustomer && (
        <>
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
        </>
      )}

      {appt.comment && (
        <div>
          <span style={{ minWidth: '20%', fontWeight: 'bold', display: 'inline-block' }}>Comment: </span>
          <span>{appt.comment}</span>
        </div>
      )}

    </div>

    {!isCustomer && (
      appt.actions.map((action, i) => (
        <div
          className="action-card"
          key={action.containerId || i}
          style={{ 
            top: `-${(i + 1) * 1.5}rem`, 
            zIndex: `-${i + 1}`
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{getFriendlyActionType(action.type, 'OPERATOR')}</div>
          <div><strong>CID: </strong>{action.containerId ? action.containerId.toUpperCase() : 'N/A'}</div>
        </div>
      ))
    )}
  </div>
);

export default ApptCard;