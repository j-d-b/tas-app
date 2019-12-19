import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';

import './ScheduleAppt.scss';
import { getDateFromTimeSlot, buildTimeSlotFromDate } from '../helpers';
import StyledDatePicker from '../components/StyledDatePicker';
import { ErrorMessage } from '../components/ResponseMessage';

const AVAILABLE_SLOTS = gql`
  query AvailableSlots ($containerSizes: [ContainerSize]!) {
    availableSlots(input: { containerSizes: $containerSizes }) {
      hour
      date
    }
  }
`;


const ScheduleAppt = ({ appt, selectTimeSlot, setIsValid }) => {
  const apptDate = appt.timeSlot ? getDateFromTimeSlot(appt.timeSlot) : null;
  const [selectedDate, selectDate] = useState(apptDate);

  const containerSizes = appt.actions.map(({ containerSize }) => containerSize);

  const { data, error, loading } = useQuery(AVAILABLE_SLOTS, { variables: { containerSizes }, fetchPolicy: 'network-only', pollInterval: 30000 });
  if (loading) return <p>Fetching available time slots...</p>;
  if (error) return <ErrorMessage>An error occurred while fetching available time slots.</ErrorMessage>;

  const availableDateTimes = data.availableSlots.map(getDateFromTimeSlot);
  if (appt.timeSlot) availableDateTimes.push(getDateFromTimeSlot(appt.timeSlot));

  const isValidDate = date => availableDateTimes.find(d => d.valueOf() === date.valueOf());

  return (
    <div>
      <StyledDatePicker
        selected={selectedDate}
        onChange={date => {
          selectDate(date);
          setIsValid && setIsValid(isValidDate(date));
          selectTimeSlot(buildTimeSlotFromDate(date));
        }}
        inline
        showTimeSelect
        timeIntervals={60}
        timeFormat="HH:mm"
        timeCaption="Hour"
        includeDates={availableDateTimes}
        includeTimes={selectedDate && availableDateTimes.filter(date => date.getDate() === selectedDate.getDate())}
      />

      {selectedDate && (
        <div>
          <div className={`selected-date${!isValidDate(selectedDate) ? ' selected-date--invalid' : ''}`}>{format(selectedDate, `iii, MMM d, yyyy 'at' HH:mm`)}</div> 
          {!isValidDate(selectedDate)  && <div className="invalid-date-message">The appointment cannot be booked for this time slot</div>}
        </div>
      )}
    </div>
  );
};

export default ScheduleAppt;