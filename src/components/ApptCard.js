import React from 'react';

import './ApptCard.scss';
import { getFriendlyActionType, getApptDate, getHourString } from '../utils';
import { ReactComponent as ImportFullIcon} from '../images/truck-import-full.svg';
import { ReactComponent as StorageEmptyIcon} from '../images/truck-storage-empty.svg';
import { ReactComponent as ExportFullIcon} from '../images/truck-export-full.svg';
import { ReactComponent as ExportEmptyIcon} from '../images/truck-export-empty.svg';

// const ActionIcon = ({ actionType, title }) => {
//   switch (actionType) {
//     case 'IMPORT_FULL': return <ImportFullIcon title={title} style={{ width: '1rem', height: '1rem' }} fill="white" />
//     case 'STORAGE_EMPTY': return <StorageEmptyIcon title={title} style={{ width: '1rem', height: '1rem' }} fill="white" />
//     case 'EXPORT_FULL': return <ExportFullIcon title={title} style={{ width: '1rem', height: '1rem' }} fill="white" />
//     case 'EXPORT_EMPTY': return <ExportEmptyIcon title={title} style={{ width: '1rem', height: '1rem' }} fill="white" />
//     default: return <div>?</div>;
//   }
// }

const ApptCardAction = ({ action, isCustomer }) => {
  const title = getFriendlyActionType(action.type, isCustomer ? 'CUSTOMER' : 'OPERATOR');

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
      <div className="appt-card__date">{getApptDate(appt).toDateString()} {!isCustomer && '(' + getHourString(getApptDate(appt).getHours()) + ')'}</div>

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
        {appt.actions.map((action, i) => <ApptCardAction key={i} action={action} isCustomer />)}
      </div>
    </div>
  </div>
);

export default ApptCard;