import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { getDateFromTimeSlot } from '../helpers';
import ScheduleAppt from './ScheduleAppt';
import { ErrorMessage } from '../components/ResponseMessage';
import { FormButton } from '../components/Form';

const RESCHEDULE_APPT = gql`
  mutation RescheduleAppt ($id: ID!, $timeSlot: TimeSlotInput!) {
    rescheduleAppt(input: { id: $id, timeSlot: $timeSlot }) {
      id
    }
  }
`;

const RescheduleAppt = ({ appt, onCompleted, refetchQueries }) => {
  const [newTimeSlot, setNewTimeSlot] = useState(null);
  const [isValidTimeSlot, setIsValidTimeSlot] = useState(false);
  const [rescheduleAppt, { error, loading }] = useMutation(RESCHEDULE_APPT, { refetchQueries, onCompleted });

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ marginTop: 0 }}>Reschedule Appointment</h1>
      <p>Currently Scheduled for <strong>{getDateFromTimeSlot(appt.timeSlot).toDateString()} ({appt.arrivalWindow})</strong></p>

      <h2>Select a new Time Slot</h2>
      <ScheduleAppt appt={appt} selectTimeSlot={setNewTimeSlot} setIsValid={setIsValidTimeSlot} />

      <FormButton
        type="button"
        style={{ width: 'calc(50% - 0.25rem)', marginRight: '0.25rem', marginTop: '1rem' }}
        onClick={onCompleted}
      >Cancel</FormButton>

      <FormButton 
        type="button"
        variety="SUCCESS"
        style={{ width: '50%' }}
        disabled={loading || !isValidTimeSlot}
        onClick={() => !loading && isValidTimeSlot && rescheduleAppt({ variables: { id: appt.id, timeSlot: newTimeSlot } })}
      >{loading ? 'Rescheduling...' : 'Reschedule'}</FormButton>

      <div style={{ textAlign: 'center' }}>
        {error && <ErrorMessage error={error} />}
      </div>
    </div>
  );
};

export default RescheduleAppt;