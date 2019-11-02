import React from 'react';

import { getFriendlyActionType, getApptDate } from '../utils';
import './ApptCard.scss';

const ApptCardLine = ({ label, data, children}) => (
  <div className="appt-card__line">
    <div className="appt-card__line__label">{label}</div>
    <div className="appt-card__line__data">{data || children}</div>
  </div>
)

const ApptCard = ({ appt, onClick, isCustomer }) => (
  <div>
    <div className="appt-card" onClick={onClick}>
      <div style={{ marginBottom: '0.5rem'}}>
        <span className="appt-card__date">{getApptDate(appt).toDateString()}</span>
        {!isCustomer && <span className="appt-card__arrival-window"> ({appt.arrivalWindow})</span>}
      </div>

      <div className="appt-card__lines">
        {isCustomer && (
          <>
            <ApptCardLine label="Arrive at:" data={appt.arrivalWindow} />
            <ApptCardLine label="Actions:">
              <div className="appt-card__actions-list">
                {appt.actions.map((action, i) => (
                  <div key={action.id}>{getFriendlyActionType(action.type, isCustomer ? 'CUSTOMER' : 'OPERATOR')}</div>
                ))}
              </div>
            </ApptCardLine>
          </>
        )}

        {!isCustomer && (
          <>
            <ApptCardLine label="Appt ID:" data={appt.id} />
            <ApptCardLine label="Customer:" data={appt.user.name} />
            <ApptCardLine label="Company:" data={appt.user.company} />
          </>
        )}

        {appt.comment && <ApptCardLine label="Comment:" data={appt.comment} />}
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
  </div>
);

export default ApptCard;