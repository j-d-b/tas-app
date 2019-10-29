import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { getApptDate, getFriendlyActionType, buildActionDetailsInput } from '../utils';
import EditApptDetails from './EditApptDetails';
import EditAction from './EditAction';
import FormButton from './FormButton';

const UPDATE_APPT = gql`
  mutation UpdateAppt ($input: UpdateApptDetailsInput!) {
    updateApptDetails(input: $input) {
      id
    }
  }
`;

const EditAppt = ({ appt, isCustomer, refetchQueries }) => {
  const [edits, setEdits] = useState(appt);
  const [updateAppt, { data, error, loading}] = useMutation(UPDATE_APPT, { refetchQueries });

  const onSubmit = e => {
    e.preventDefault();
    updateAppt({
      variables: {
        input: {
          id: appt.id,
          comment: edits.comment,
          notifyMobileNumber: edits.notifyMobileNumber,
          licensePlateNumber: edits.licensePlateNumber,
          actionDetails: edits.actions.map(action => (
            {
              id: action.id,
              ...(buildActionDetailsInput(action))
            }
          ))
        }
      }
    })
  };

  return (
    <div>
      <h1>Appointment: {appt.id}</h1>

      <div>
        <h2 style={{ marginBottom: 0 }}>{getApptDate(appt).toDateString()} ({appt.arrivalWindow})</h2>
      </div>

      {!isCustomer && (
        <div>
          <h2>Customer</h2>

          <div><strong>Email: </strong>{appt.user.email}</div>
          <div><strong>Name: </strong>{appt.user.name}</div>
          <div><strong>Company: </strong>{appt.user.company}</div>
        </div>
      )}

      <form name="appt" onSubmit={onSubmit}>
        <h2>Details</h2>

        <EditApptDetails appt={edits} onEdit={setEdits} />

        {edits.actions.map((action, index) => (
          <div key={action.id}>
            <h2>Action {index + 1}: {getFriendlyActionType(action.type, isCustomer ? 'CUSTOMER' : 'OPERATOR')}</h2>
            <div><strong>Container Size: </strong>{action.containerSize}</div>
            <EditAction
              action={action}
              onEdit={editedAction => {
                const newActions = edits.actions.map((a, i) => i === index ? editedAction : a);
                setEdits({ ...edits, actions: newActions });
              }}
            />
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormButton style={{ marginRight: '0.5rem' }} type="button" onClick={() => console.log('todo')}>Reschedule</FormButton>
          <FormButton type="submit" variety="SUCCESS" disabled={loading}>{loading ? 'Saving...' : 'Save'}</FormButton>
        </div>

        {error && <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error.toString()}</div>}
        {data && <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'green', marginTop: '0.5rem', fontSize: '0.9rem' }}>Changes saved successfully!</div>}
      </form>
    </div>
  );
};

export default EditAppt;