import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';

import './ScheduleAppt.scss';
import { getDateFromTimeSlot, getTimeSlotFromDate } from '../utils';
import StyledDatePicker from '../components/StyledDatePicker';

const AVAILABLE_SLOTS = gql`
  query AvailableSlots ($containerSizes: [ContainerSize]!) {
    availableSlots(input: { importFullContainerIds: [], knownContainerSizes: $containerSizes }) {
      hour
      date
    }
  }
`;

const isValidDate = (availableDateTimes, selectedDate) => availableDateTimes.includes(selectedDate.getTime());

const ScheduleAppt = ({ appt, selectTimeSlot, setIsValid }) => {
  const [selectedDate, selectDate] = useState(appt.timeSlot ? new Date(getDateFromTimeSlot(appt.timeSlot)) : null);
  const containerSizes = appt.actions.map(({ containerSize }) => containerSize);

  const { data, error, loading } = useQuery(AVAILABLE_SLOTS, { variables: { containerSizes }, fetchPolicy: 'network-only', pollInterval: 30000 });

  if (loading) return <p>Fetching available time slots...</p>;

  if (error) return <p>An error occurred while fetching available time slots.</p>;

  const availableDateTimes = data.availableSlots.map(getDateFromTimeSlot);

  return (
    <div>
      <StyledDatePicker
        selected={selectedDate}
        onChange={date => {
          selectDate(date);
          setIsValid && setIsValid(isValidDate(availableDateTimes, date));
          selectTimeSlot(getTimeSlotFromDate(date));
        }}
        inline
        showTimeSelect
        timeIntervals={60}
        timeFormat="HH:mm"
        timeCaption="Hour"
        includeDates={availableDateTimes}
        includeTimes={selectedDate && availableDateTimes.filter(date => new Date(date).getDate() === selectedDate.getDate())}
      />

      {selectedDate && (
        <div>
          <div className={`selected-date${!isValidDate(availableDateTimes, selectedDate) ? ' selected-date--invalid' : ''}`}>{format(selectedDate, `iii, MMM d, yyyy 'at' HH:mm`)}</div> 
          {!isValidDate(availableDateTimes, selectedDate) && <div className="invalid-date-message">The appointment cannot be booked for this time slot</div>}
        </div>
      )}
    </div>
  );
};

export default ScheduleAppt;