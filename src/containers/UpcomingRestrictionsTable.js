import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { startOfToday, addDays, addWeeks, isBefore, endOfToday, format } from 'date-fns/esm';
import { CSSTransition } from 'react-transition-group';

import './UpcomingRestrictionsTable.scss';
import RestrictionsTable from '../components/RestrictionsTable';
import RightAlign from '../components/RightAlign';
import { ErrorMessage, SuccessMessage } from '../components/ResponseMessage';
import { isTimeSlotEqual, getDateFromTimeslot } from '../utils';

const DEFAULT_ALLOWED_APPTS_PER_HOUR = gql`
  { defaultAllowedApptsPerHour }
`;

const GLOBAL_RESTRICTIONS = gql`
  query GlobalRestrictions ($startDate: ISODate, $endDate: ISODate) {
    globalRestrictions(input: { startDate: $startDate, endDate: $endDate }) {
      id
      gateCapacity
      timeSlot {
        date
        hour
      }
    }
  }
`;

const ADD_GLOBAL_RESTRICTION = gql`
  mutation AddGlobalRestriction ($timeSlot: TimeSlotInput!, $gateCapacity: Int!) {
    addGlobalRestrictions (input: [{ timeSlot: $timeSlot, gateCapacity: $gateCapacity }]) {
      gateCapacity
      hour
    }
  }
`;

const DELETE_RESTRICTION = gql`
  mutation DeleteRestriction ($id: ID!) {
    deleteRestriction (input: { id: $id })
  }
`;

const getDatesInNextWeek = () => {
  const oneWeekFromToday = addWeeks(endOfToday(), 1);

  let datesInNextWeek = [];
  let currDate = startOfToday();
  while (isBefore(currDate, oneWeekFromToday)) {
    datesInNextWeek.push(currDate);
    currDate = addDays(currDate, 1);
  }

  return datesInNextWeek;
};

const UpcomingRestrictionsTable = ({ appliedTemplate }) => {
  const { data: defaultAllowedApptsData } = useQuery(DEFAULT_ALLOWED_APPTS_PER_HOUR);

  const nextWeekGlobalRestrictionsVariables = {
    startDate: format(startOfToday(), 'yyyy-MM-dd'),
    endDate: format(addWeeks(new Date(), 1), 'yyyy-MM-dd')
  };

  const { data: globalRestrictionsData } = useQuery(
    GLOBAL_RESTRICTIONS,
    { variables: nextWeekGlobalRestrictionsVariables }
  );

  const [addGlobalRestriction, { data: addGlobalRestrictionData, error: addGlobalRestrictionError }] = useMutation(
    ADD_GLOBAL_RESTRICTION,
    { refetchQueries: [{ query: GLOBAL_RESTRICTIONS, variables: nextWeekGlobalRestrictionsVariables }] }
  );

  const [deleteRestriction, { data: deleteRestrictionData, error: deleteRestrictionError }] = useMutation(
    DELETE_RESTRICTION,
    { refetchQueries: [{ query: GLOBAL_RESTRICTIONS, variables: nextWeekGlobalRestrictionsVariables }] }
  );

  const [hasSaveResponse, setHasSaveResponse] = useState(false);
  useEffect(() => {
    setHasSaveResponse(true);
    const timeout = window.setTimeout(() => setHasSaveResponse(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [addGlobalRestrictionData, deleteRestrictionData, addGlobalRestrictionError, deleteRestrictionError]);

  if (!globalRestrictionsData || !defaultAllowedApptsData) return <div>Loading...</div> // TODO include applied template

  const getValueStyle = timeSlot => {
    const matchingGlobalRestriction =  globalRestrictionsData.globalRestrictions.find(res => isTimeSlotEqual(timeSlot, res.timeSlot));
    if (matchingGlobalRestriction) {
      return { value: matchingGlobalRestriction.gateCapacity, style: { color: 'blue' } };
    }
  
    if (appliedTemplate) {
      const dayOfWeek = format(getDateFromTimeslot(timeSlot), 'EEEE').toUpperCase();
      const matchingTemplateRestriction = appliedTemplate.restrictions.find(res => res.dayOfWeek === dayOfWeek && res.hour === timeSlot.hour);
      if (matchingTemplateRestriction) {
        return { value: matchingTemplateRestriction.gateCapacity };
      }
    }
  
    return { value: defaultAllowedApptsData.defaultAllowedApptsPerHour, style: { color: 'graytext' } };
  };

  return (
    <div>
      <RestrictionsTable
        dates={getDatesInNextWeek()}
        addRestriction={(timeSlot, gateCapacity) => addGlobalRestriction({ variables: { timeSlot, gateCapacity }})}
        deleteRestriction={timeSlot => {
          const restriction = globalRestrictionsData.globalRestrictions.find(res => isTimeSlotEqual(res.timeSlot, timeSlot));
          if (restriction) {
            deleteRestriction({ variables: { id: restriction.id }});
          }
        }}
        getValueStyle={getValueStyle}
      />
      
      <div style={{ height: '1.5rem' }}>
        <CSSTransition in={hasSaveResponse} classNames="response-message" timeout={300} unmountOnExit>
          <RightAlign>
            {(addGlobalRestrictionData || deleteRestrictionData) && <SuccessMessage>Saved successfully!</SuccessMessage>}
            {(addGlobalRestrictionError || deleteRestrictionError) && <ErrorMessage>Error: value not saved</ErrorMessage>}
          </RightAlign>
        </CSSTransition>
      </div>
    </div>
  );
}

export default UpcomingRestrictionsTable;