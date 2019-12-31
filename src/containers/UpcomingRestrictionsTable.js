import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { startOfDay, endOfDay, addDays, subDays, addWeeks, isBefore, format } from 'date-fns/esm';
import { CSSTransition } from 'react-transition-group';

import './UpcomingRestrictionsTable.scss';
import { useCurrServerTime } from '../utils';
import { getDateFromTimeSlot, isTimeSlotEqual } from '../helpers';
import RestrictionsTable from '../components/RestrictionsTable';
import RightAlign from '../components/RightAlign';
import { ErrorMessage, SuccessMessage } from '../components/ResponseMessage';

const APPLIED_TEMPLATE = gql`
  {
    appliedRestrictionTemplate (input: {}) {
      name
      restrictions {
        dayOfWeek
        gateCapacity
        hour
      }
    }
  }
`;

const DEFAULT_ALLOWED_APPTS_PER_HOUR = gql`
  { defaultAllowedApptsPerHour }
`;

const GLOBAL_RESTRICTIONS = gql`
  query GlobalRestrictions ($startTimeSlotDate: ISODate, $endTimeSlotDate: ISODate) {
    globalRestrictions(input: { startTimeSlotDate: $startTimeSlotDate, endTimeSlotDate: $endTimeSlotDate }) {
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
      timeSlot {
        date
        hour
      }
    }
  }
`;

const DELETE_RESTRICTION = gql`
  mutation DeleteRestriction ($id: ID!) {
    deleteRestriction (input: { id: $id })
  }
`;

const getDatesInNextWeek = currServerTime => {
  const oneWeekFromToday = addWeeks(endOfDay(currServerTime), 1);

  let datesInNextWeek = [];
  let currDate = startOfDay(currServerTime);
  while (isBefore(currDate, oneWeekFromToday)) {
    datesInNextWeek.push(currDate);
    currDate = addDays(currDate, 1);
  }

  return datesInNextWeek;
};

const UpcomingRestrictionsTable = () => {
  const client = useApolloClient();
  const currServerTime = useCurrServerTime(client);

  const [loadingTimeSlots, setLoadingTimeSlots] = useState([]);

  const { data: appliedTemplateData } = useQuery(APPLIED_TEMPLATE);
  
  const { data: defaultAllowedApptsData } = useQuery(DEFAULT_ALLOWED_APPTS_PER_HOUR);

  const nextWeekGlobalRestrictionsVariables = !currServerTime 
    ? { // get a bit more data than we need until we can fetch the exact data once we have currServerTime 
      startTimeSlotDate: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
      endTimeSlotDate: format(addWeeks(addDays(new Date(), 1), 1), 'yyyy-MM-dd')
    } 
    : {
      startTimeSlotDate: format(currServerTime, 'yyyy-MM-dd'),
      endTimeSlotDate: format(addWeeks(currServerTime, 1), 'yyyy-MM-dd')
    };

  const { data: globalRestrictionsData } = useQuery(
    GLOBAL_RESTRICTIONS,
    { variables: nextWeekGlobalRestrictionsVariables }
  );

  const [addGlobalRestriction, { data: addGlobalRestrictionData, error: addGlobalRestrictionError }] = useMutation(
    ADD_GLOBAL_RESTRICTION,
    { 
      refetchQueries: [{ query: GLOBAL_RESTRICTIONS, variables: nextWeekGlobalRestrictionsVariables }],
      onCompleted: ({ addGlobalRestrictions }) => setLoadingTimeSlots(loadingTimeSlots.filter(slot => !addGlobalRestrictions.find(res => isTimeSlotEqual(res.timeSlot, slot))))
    }
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

  if (!currServerTime) return <div>Loading...</div>;
  if (currServerTime === 'ERROR') return <ErrorMessage>An error occurred</ErrorMessage>;

  if (!globalRestrictionsData || !defaultAllowedApptsData || !appliedTemplateData) return <div style={{ marginBottom: '0.5rem' }}>Loading...</div>;

  const getValueStyle = timeSlot => {
    const matchingGlobalRestriction = globalRestrictionsData.globalRestrictions.find(res => isTimeSlotEqual(timeSlot, res.timeSlot));

    if (matchingGlobalRestriction) {
      return { value: matchingGlobalRestriction.gateCapacity, style: { color: '#0065ff' } };
    }
  
    if (appliedTemplateData && appliedTemplateData.appliedRestrictionTemplate) {
      const dayOfWeek = format(getDateFromTimeSlot(timeSlot), 'EEEE').toUpperCase();
      const matchingTemplateRestriction = appliedTemplateData.appliedRestrictionTemplate.restrictions.find(res => res.dayOfWeek === dayOfWeek && res.hour === timeSlot.hour);
      if (matchingTemplateRestriction) {
        return { value: matchingTemplateRestriction.gateCapacity };
      }
    }
  
    return { value: defaultAllowedApptsData.defaultAllowedApptsPerHour, style: { color: 'graytext' } };
  };

  return (
    <div className="upcoming-restrictions">
      <div className="upcoming-restrictions-table-wrapper">
        <RestrictionsTable
          dates={getDatesInNextWeek(currServerTime)}
          currServerTime={currServerTime}
          addRestriction={(timeSlot, gateCapacity) => {
            addGlobalRestriction({ variables: { timeSlot, gateCapacity } });
            setLoadingTimeSlots([...loadingTimeSlots, timeSlot]);
          }}
          deleteRestriction={timeSlot => {
            const restriction = globalRestrictionsData.globalRestrictions.find(res => isTimeSlotEqual(res.timeSlot, timeSlot));
            if (restriction) {
              deleteRestriction({ variables: { id: restriction.id } });
            }
          }}
          loadingTimeSlots={loadingTimeSlots}
          getValueStyle={getValueStyle}
        />
      </div>
      
      <div style={{ height: '1.5rem' }}>
        <CSSTransition in={hasSaveResponse} classNames="response-message" timeout={300} unmountOnExit>
          <RightAlign>
            {(addGlobalRestrictionData || deleteRestrictionData) && <SuccessMessage>Saved successfully!</SuccessMessage>}
            {(addGlobalRestrictionError || deleteRestrictionError) && <ErrorMessage>An error occurred. the value may have not been saved</ErrorMessage>}
          </RightAlign>
        </CSSTransition>
      </div>
    </div>
  );
};

export default UpcomingRestrictionsTable;