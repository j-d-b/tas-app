import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { getApptDate, getFriendlyActionType, buildActionDetailsInput } from '../utils';
import EditApptDetails from '../components/EditApptDetails';
import EditAction from '../components/EditAction';
import { FormButton } from '../components/Form';
import RightAlign from '../components/RightAlign';
import ScheduleAppt from './ScheduleAppt';

const UPDATE_APPT = gql`
  mutation UpdateAppt ($input: UpdateApptDetailsInput!) {
    updateApptDetails(input: $input) {
      id
    }
  }
`;

const DELETE_APPT = gql`
  mutation DeleteAppt ($id: ID!) {
    deleteAppt(input: { id: $id })
  }
`;

const RESCHEDULE_APPT = gql`
  mutation RescheduleAppt ($id: ID!, $timeSlot: TimeSlotInput!) {
    rescheduleAppt(input: { id: $id, timeSlot: $timeSlot }) {
      id
    }
  }
`;

const EditAppt = ({ appt, isCustomer, refetchQueries, onDelete }) => {
  const [edits, setEdits] = useState(appt);
  const [updateAppt, { data, error, loading}] = useMutation(UPDATE_APPT, { refetchQueries });

  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [deleteAppt, deleteApptResults] = useMutation(DELETE_APPT, { refetchQueries, onCompleted: onDelete });

  const [newTimeSlot, setNewTimeSlot] = useState(null);
  const [isValidTimeSlot, setIsValidTimeSlot] = useState(false);
  const [isReschedule, setIsReschedule] = useState(false);
  const closeRescheduleWindow = () => {
    setIsValidTimeSlot(false);
    setNewTimeSlot(null);
    setIsReschedule(false);
  };
  const [rescheduleAppt, rescheduleApptResults] = useMutation(RESCHEDULE_APPT, { refetchQueries, onCompleted: closeRescheduleWindow });

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

  if (isReschedule) {
    return (
      <div>
        <h1 style={{ marginTop: '0.5rem' }}>Reschedule Appointment</h1>
        <p>Currently Scheduled for <strong>{getApptDate(appt).toDateString()} ({appt.arrivalWindow})</strong></p>

        <h2>Select a new Time Slot</h2>
        <ScheduleAppt appt={appt} selectTimeSlot={setNewTimeSlot} setIsValid={setIsValidTimeSlot} />
        <RightAlign>
          <FormButton
            type="button"
            style={{ marginRight: '0.5rem' }}
            onClick={closeRescheduleWindow}
          >Cancel</FormButton>

          <FormButton 
            type="button"
            variety="SUCCESS"
            disabled={rescheduleApptResults.loading || !isValidTimeSlot}
            onClick={() => !rescheduleApptResults.loading && isValidTimeSlot && rescheduleAppt({ variables: { id: appt.id, timeSlot: newTimeSlot } })}
          >{rescheduleApptResults.loading ? 'Rescheduling...' : 'Reschedule'}</FormButton>
          {rescheduleApptResults.error && <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error.toString()}</div>}
        </RightAlign>
      </div>
    );
  }

  if (isDeleteConfirm) {
    return (
      <div>
        <h1 style={{ marginTop: '0.5rem' }}>Confirm Deletion</h1>
        <p>Are you sure you want to delete your appointment for <strong>{getApptDate(appt).toDateString()}</strong> at <strong>{appt.arrivalWindow}</strong>?</p>
        <RightAlign>
          <FormButton
            type="button"
            style={{ marginRight: '0.5rem' }}
            onClick={() => setIsDeleteConfirm(false)}
          >Cancel</FormButton>
          <FormButton 
            type="button"
            variety="DANGER"
            disabled={deleteApptResults.loading}
            onClick={() => !deleteApptResults.loading && deleteAppt({ variables: { id: appt.id } })}
          >{deleteApptResults.loading ? 'Deleting...' : 'Delete'}</FormButton>
          {deleteApptResults.error && <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error.toString()}</div>}
        </RightAlign>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Appointment: {appt.id}</h1>

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
          <FormButton
            style={{ marginRight: '0.5rem' }}
            type="button"
            variety="DANGER"
            onClick={() => setIsDeleteConfirm(true)}
          >Delete</FormButton>

          <FormButton
            style={{ marginRight: '0.5rem' }}
            type="button"
            onClick={() => setIsReschedule(true)}
          >Reschedule</FormButton>

          <FormButton
            type="submit"
            variety="SUCCESS"
            disabled={loading}
          >{loading ? 'Saving...' : 'Save'}</FormButton>
        </div>

        {error && <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error.toString()}</div>}
        {data && <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'green', marginTop: '0.5rem', fontSize: '0.9rem' }}>Changes saved successfully!</div>}
        {rescheduleApptResults.data && <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'green', marginTop: '0.5rem', fontSize: '0.9rem' }}>Appointment rescheduled successfully!</div>}
      </form>
    </div>
  );
};

export default EditAppt;