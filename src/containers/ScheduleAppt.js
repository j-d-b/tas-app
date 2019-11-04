import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { getDateFromTimeslot, getHourString, getTimeSlotFromDate } from '../utils';
import StyledDatePicker from '../components/StyledDatePicker';

const AVAILABLE_SLOTS = gql`
  query AvailableSlots ($containerSizes: [ContainerSize]!) {
    availableSlots(input: { importFullContainerIds: [], knownContainerSizes: $containerSizes }) {
      hour
      date
    }
  }
`;

const ScheduleAppt = ({ appt, setTimeSlot }) => {
  const [selectedDate, selectDate]= useState(null);
  const containerSizes = appt.actions.map(({ containerSize }) => containerSize);

  const { data, error, loading } = useQuery(AVAILABLE_SLOTS, { variables: { containerSizes }});

  if (loading) return <p>Fetching available time slots...</p>;

  if (error) return <p>An error occurred, while fetching available time slots. {error.toString()}</p>;

  const availableDateTimes = data.availableSlots.map(getDateFromTimeslot);

  return (
    <div>
      <StyledDatePicker
        selected={selectedDate}
        onChange={date => {
          selectDate(date);
          setTimeSlot(getTimeSlotFromDate(date));
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
        availableDateTimes.includes(selectedDate.getTime())
          ? <div style={{ marginTop: '0.5rem', fontSize: '1.2rem' }}>{selectedDate.toDateString()} at {getHourString(new Date(selectedDate).getHours())}</div>
          : <div style={{ marginTop: '0.5rem', fontSize: '1.2rem' }}>The appointment cannot be booked for this time slot.</div>
      )}
    </div>
  );
};

export default ScheduleAppt;