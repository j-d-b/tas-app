import React from 'react';
import { format } from 'date-fns';

import './ApptCard.scss';
import { ReactComponent as ChevronRight } from '../images/chevron-right-solid.svg';
import { getFriendlyActionType, getApptDate } from '../utils';

const ApptCardAction = ({ action, isCustomer }) => {
  const title = getFriendlyActionType(action.type, isCustomer ? 'CUSTOMER' : 'ADMIN');

  return (
    <div className={`appt-card__action appt-card__action--${action.type}`}>
      {title} {action.containerId && <span className="appt-card__action__cid">({action.containerId})</span>}
    </div>
  );
}

const ApptCard = ({ appt, onClick, isCustomer }) => (
  <div className="appt-card" onClick={onClick}>
    <div className="appt-card-details">
      <div className="appt-card__id">{appt.id}</div>
      {!isCustomer && <div className="appt-card__customer">{appt.user.name} <span className="appt-card__company">({appt.user.company})</span></div>}
      <div className="appt-card__date">{!isCustomer ? format(getApptDate(appt), `MMM d, yyyy '—' HH:mm`) : format(getApptDate(appt), `iii, MMM d, yyyy`)}</div>
      <div className="appt-card__arrival-window">{appt.arrivalWindow}</div>
      <div className="appt-card__actions-list">
        {appt.actions.map((action, i) => <ApptCardAction key={i} action={action} isCustomer={isCustomer} />)}
      </div>
    </div>

    <button className="appt-card__view-details-button" type="button" onClick={onClick}>
      View Details <ChevronRight />
    </button>
  </div>
);

export default ApptCard;