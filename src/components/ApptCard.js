import React from 'react';

import './ApptCard.scss';
import { getFriendlyActionType, getApptDate, getHourString } from '../utils';

const ApptCardAction = ({ action, isCustomer }) => {
  const title = getFriendlyActionType(action.type, isCustomer ? 'CUSTOMER' : 'ADMIN');

  return (
    <div className={`appt-card__action appt-card__action--${action.type}`}>
      {/* <ActionIcon title={title} actionType={action.type} /> */}
      {title} {action.containerId && <span className="appt-card__action__cid">({action.containerId})</span>}
    </div>
  );
}

const ApptCard = ({ appt, onClick, isCustomer }) => (
  <div>
    <div className="appt-card" onClick={onClick}>
      <div className="appt-card__date">{getApptDate(appt).toDateString()} {!isCustomer && '— ' + getHourString(getApptDate(appt).getHours())}</div>

      {!isCustomer && (
        <div>
          <div><span className="appt-card__field-name">ID ·</span> {appt.id}</div>
          <div><span className="appt-card__field-name">CUSTOMER ·</span> {appt.user.name} ({appt.user.company})</div>
        </div>
      )}

      <div>
        <span className="appt-card__field-name">{isCustomer ? 'ARRIVE AT' : 'ARRIVAL WINDOW'} ·</span> {appt.arrivalWindow}
      </div>

      {appt.comment && <div><span className="appt-card__field-name">COMMENT ·</span> {appt.comment}</div>}

      <div className="appt-card__actions-list">
        {appt.actions.map((action, i) => <ApptCardAction key={i} action={action} isCustomer={isCustomer} />)}
      </div>
    </div>
  </div>
);

export default ApptCard;