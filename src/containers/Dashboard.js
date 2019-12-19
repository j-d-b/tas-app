import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { startOfToday, addWeeks, endOfDay } from 'date-fns';

import './Dashboard.scss';
import { buildTimeSlotFromDate } from '../helpers';
import { formatError } from '../helpers';
import { getDateFromTimeSlot } from '../helpers';
import Modal from '../components/Modal';
import OrganizeBox from '../components/OrganizeBox';
import ApptCard from '../components/ApptCard';
import Appt from './Appt';

const ALL_APPTS = gql`
  query Appts ($fromTimeSlot: TimeSlotInput, $toTimeSlot: TimeSlotInput, $actionType: ActionType) {
    appts (input: { fromTimeSlot: $fromTimeSlot, toTimeSlot: $toTimeSlot, where: { actionType: $actionType } }) {
      id
      user {
        name
        company
      }
      timeSlot {
        date
        hour
      }
      arrivalWindow
      actions {
        id
        type
        containerId
      }
    }
  }
`;

const NoAppts = () => (
  <div>
    <h1 style={{ marginTop: 0, marginBottom: '0.5rem' }}>No Matching Appointments</h1>
    <p>Try adjusting your filter criteria</p>
  </div>
);

const ApptsError = ({ error }) => {
  const errorMessage = formatError(error);

  if (errorMessage === 'The appointments query yielded too many results to send') {
    return (
      <div>
        <h1 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Too Many Appointments</h1>
        <div style={{ marginBottom: '0.5rem' }}>The appointments query yielded too many results to send</div>
        <div>Please adjust your filter criteria</div>
      </div>
    );
  }

  return <div>{errorMessage}</div>;
};

const INIT_FILTERS = {
  search: '',
  type: 'ALL',
  fromDate: startOfToday(),
  toDate: endOfDay(addWeeks(startOfToday(), 1))
};

const INIT_SORT = {
  by: 'TIME_SLOT',
  direction: 'ASCENDING'
};

const satisfiesSearch = search => appt => {
  const lowerCaseSearch = search.toLowerCase();
  return !search
  || appt.id.toLowerCase().includes(lowerCaseSearch)
  || appt.user.name.toLowerCase().includes(lowerCaseSearch)
  || appt.user.company.toLowerCase().includes(lowerCaseSearch)
  || appt.actions.reduce((matchesSearch, { containerId }) => matchesSearch || (containerId && containerId.toLowerCase().includes(lowerCaseSearch)), false);
};

const createSort = sort => (apptA, apptB) => {
  switch (sort.by) {
    case 'TIME_SLOT': {
      const dateA = getDateFromTimeSlot(apptA.timeSlot);
      const dateB = getDateFromTimeSlot(apptB.timeSlot);
      if (dateA > dateB) return sort.direction === 'ASCENDING' ? 1 : -1;
      if (dateB > dateA) return sort.direction === 'ASCENDING' ? -1 : 1;
      return 0;
    }
    case 'CUSTOMER': {
      if (apptA.user.name > apptB.user.name) return sort.direction === 'ASCENDING' ? 1 : -1;
      if (apptB.user.name > apptA.user.name) return sort.direction === 'ASCENDING' ? -1 : 1;
      return 0;
    }
    case 'COMPANY': {
      if (apptA.user.company > apptB.user.company) return sort.direction === 'ASCENDING' ? 1 : -1;
      if (apptB.user.company > apptA.user.company) return sort.direction === 'ASCENDING' ? -1 : 1;
      return 0;
    }
    default: {
      return 0;
    }
  }
};

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApptId, selectApptId] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(INIT_FILTERS);
  const [sort, setSort] = useState(INIT_SORT);
  const { data, error, loading } = useQuery(
    ALL_APPTS,
    { 
      variables: { 
        ...(filters.fromDate && { fromTimeSlot: buildTimeSlotFromDate(filters.fromDate) }),
        ...(filters.toDate && { toTimeSlot:  buildTimeSlotFromDate(filters.toDate) }),
        ...(filters.type !== 'ALL' && { actionType: filters.type })
      },
      fetchPolicy: 'network-only'
    }
  );

  const reset = () => {
    setSearch('');
    setFilters(INIT_FILTERS);
    setSort(INIT_SORT);
  };

  let appts;
  if (data) {
    appts = data.appts
      .filter(satisfiesSearch(search))
      .sort(createSort(sort));
  }

  return (
    <div className="dashboard-page">
      <div className="organize-box-col">
        <div>
          <div className="organize-box-container">
            <OrganizeBox
              search={search}
              setSearch={setSearch}
              filters={filters}
              setFilters={setFilters}
              sort={sort}
              setSort={setSort}
              reset={reset}
            />
          </div>
        </div>
      </div>

      <div className="appts-col">
        <div>
          <div className="appts-container">
            {error && <ApptsError error={error} />}
            {loading && <div>Loading appointments...</div>}
            {(data && !error) && (
              <>
                {!appts.length && <NoAppts />}
                {appts.map(appt => (
                  <ApptCard
                    appt={appt}
                    key={appt.id}
                    onClick={() => {
                      selectApptId(appt.id);
                      setIsModalOpen(true);
                    }} 
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClosed={() => selectApptId(null)}
        closeModal={() => setIsModalOpen(false)}
        title="View Appt"
      >
        <Appt apptId={selectedApptId} refetchQueries={[{ query: ALL_APPTS }]} onDelete={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;