import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';

import './Appt.scss';
import Action from '../components/Action';
import { getApptDate, getFriendlyActionType } from '../utils';
import EditAppt from './EditAppt';
import { FormButton } from '../components/Form';
import ScheduleAppt from './ScheduleAppt';
import { ErrorMessage } from '../components/ResponseMessage';

const RESCHEDULE_APPT = gql`
  mutation RescheduleAppt ($id: ID!, $timeSlot: TimeSlotInput!) {
    rescheduleAppt(input: { id: $id, timeSlot: $timeSlot }) {
      id
    }
  }
`;

const DELETE_APPT = gql`
  mutation DeleteAppt ($id: ID!) {
    deleteAppt(input: { id: $id })
  }
`;

const Appt = ({ appt, isCustomer, refetchQueries, onDelete, isReadOnly }) => {
  const [isEditMode, setIsEditMode] = useState(false);

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

  if (isReschedule) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginTop: 0 }}>Reschedule Appointment</h1>
        <p>Currently Scheduled for <strong>{getApptDate(appt).toDateString()} ({appt.arrivalWindow})</strong></p>

        <h2>Select a new Time Slot</h2>
        <ScheduleAppt appt={appt} selectTimeSlot={setNewTimeSlot} setIsValid={setIsValidTimeSlot} />

        <FormButton
          type="button"
          style={{ width: 'calc(50% - 0.25rem)', marginRight: '0.25rem', marginTop: '1rem' }}
          onClick={closeRescheduleWindow}
        >Cancel</FormButton>

        <FormButton 
          type="button"
          variety="SUCCESS"
          style={{ width: '50%' }}
          disabled={rescheduleApptResults.loading || !isValidTimeSlot}
          onClick={() => !rescheduleApptResults.loading && isValidTimeSlot && rescheduleAppt({ variables: { id: appt.id, timeSlot: newTimeSlot } })}
        >{rescheduleApptResults.loading ? 'Rescheduling...' : 'Reschedule'}</FormButton>

        <div style={{ textAlign: 'center' }}>
          {rescheduleApptResults.error && <ErrorMessage error={rescheduleApptResults.error} />}
        </div>
      </div>
    );
  }

  if (isDeleteConfirm) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginTop: 0 }}>Confirm Deletion</h1>
        <p>Are you sure you want to delete your appointment for <strong>{getApptDate(appt).toDateString()}</strong> at <strong>{appt.arrivalWindow}</strong>?</p>
        <FormButton
          type="button"
          style={{ width: 'calc(50% - 0.25rem)', marginRight: '0.25rem' }}
          onClick={() => setIsDeleteConfirm(false)}
        >Cancel</FormButton>
        <FormButton 
          type="button"
          style={{ width: '50%' }}
          variety="DANGER"
          disabled={deleteApptResults.loading}
          onClick={() => !deleteApptResults.loading && deleteAppt({ variables: { id: appt.id } })}
        >{deleteApptResults.loading ? 'Deleting...' : 'Delete'}</FormButton>

        {deleteApptResults.error && <ErrorMessage error={deleteApptResults.error} />}
      </div>
    );
  }

  if (isEditMode) {
    return <EditAppt appt={appt} refetchQueries={refetchQueries} onCompleted={() => setIsEditMode(false)}/>;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Appointment: {appt.id}</h1>

      <h2 style={{ marginBottom: '0.5rem' }}>Details</h2>

      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <th>Date</th>
            <td>{format(getApptDate(appt), `iii, MMM d, yyyy`)}</td>
          </tr>
          <tr>
            <th>{isCustomer ? 'Time' : 'Arrival Window'}</th>
            <td>{appt.arrivalWindow}</td>
          </tr>
          <tr>
            <th>Comment</th>
            <td>{appt.comment}</td>
          </tr>
          <tr>
            <th>Driver Mobile Number</th>
            <td>{appt.notifyMobileNumber}</td>
          </tr>
          <tr>
            <th>Company</th>
            <td>{appt.licensePlateNumber}</td>
          </tr>
        </tbody>
      </table>

      {!isCustomer && (
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Customer</h2>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <th>Email</th>
                <td>{appt.user.email}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{appt.user.name}</td>
              </tr>
              <tr>
                <th>Company</th>
                <td>{appt.user.company}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {appt.actions.map((action, index) => (
        <div key={action.id}>
          <h2 style={{ marginBottom: '0.5rem' }}>Action {index + 1}: {getFriendlyActionType(action.type, isCustomer ? 'CUSTOMER' : 'OPERATOR')}</h2>
          <Action action={action} />
        </div>
      ))}

      {!isReadOnly && (
        <div className="appt-button-row">
          <FormButton
            type="button"
            variety="DANGER"
            onClick={() => setIsDeleteConfirm(true)}
          >Delete</FormButton>

          <FormButton
            type="button"
            onClick={() => setIsReschedule(true)}
          >Reschedule</FormButton>

          <FormButton
            type="button"
            onClick={() => setIsEditMode(true)}
          >Edit</FormButton>
        </div>
      )}
    </div>
  );
};

export default Appt;