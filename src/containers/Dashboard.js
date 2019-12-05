import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';

import './Dashboard.scss';
import { getDateFromTimeSlot } from '../utils';
import Modal from '../components/Modal';
import OrganizeBox from '../components/OrganizeBox';
import ApptCard from '../components/ApptCard';
import Appt from '../components/Appt';

const ALL_APPTS = gql`
  query Appts ($startDate: ISODate, $endDate: ISODate, $actionType: ActionType) {
    appts (input: { startDate: $startDate, endDate: $endDate, where: { actionType: $actionType } }) {
      id
      user {
        email
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
        containerSize
        containerId
        shippingLine
        containerType
        formNumber705
        emptyForCityFormNumber
        containerWeight
        bookingNumber
      }
      licensePlateNumber
      notifyMobileNumber
      comment
    }
  }
`;

const NoAppts = () => (
  <div>
    <h1 style={{ marginTop: 0, marginBottom: '0.5rem' }}>No Matching Appointments</h1>
    <p>Try adjusting your filter criteria.</p>
  </div>
);

const getThisMonday = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const thisMonday = new Date(today.setDate(diff));
  thisMonday.setHours(0);
  thisMonday.setMinutes(0);
  thisMonday.setSeconds(0);
  thisMonday.setMilliseconds(0);
  return thisMonday;
};

const getThisSunday = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + 7;
  const thisSunday = new Date(today.setDate(diff));
  thisSunday.setHours(23);
  thisSunday.setMinutes(59);
  thisSunday.setSeconds(59);
  thisSunday.setMilliseconds(999);
  return thisSunday;
};

const INIT_FILTERS = {
  search: '',
  type: 'ALL',
  from: getThisMonday(),
  to: getThisSunday()
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

// backend API only allows selecting within a date range, not hour range
const satisfiesHourFilters = filters => appt => {
  const apptDate = getDateFromTimeSlot(appt.timeSlot);
  const satisfiesFrom = !filters.from || apptDate >= filters.from;
  const satisfiesTo = !filters.to || apptDate <= filters.to;
  return satisfiesFrom && satisfiesTo;
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
  const [selectedAppt, selectAppt] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(INIT_FILTERS);
  const [sort, setSort] = useState(INIT_SORT);
  const { data, error, loading } = useQuery(
    ALL_APPTS,
    { 
      variables: { 
        ...(filters.from && { startDate: format(filters.from, 'yyyy-MM-dd') }),
        ...(filters.to && { endDate: format(filters.to, 'yyyy-MM-dd') }),
        ...(filters.type !== 'ALL' && { where: { actionType: filters.type } })
      }
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
      .filter(satisfiesHourFilters(filters))
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
            {error && <div>{error.toString()}</div>}
            {loading && <div>Loading appointments...</div>}
            {data && (
              <>
                {!appts.length && <NoAppts />}
                {appts.map(appt => (
                  <ApptCard
                    appt={appt}
                    key={appt.id}
                    onClick={() => {
                      selectAppt(appt);
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
        onClosed={() => selectAppt(null)}
        closeModal={() => setIsModalOpen(false)}
        title="View Appt"
      >
        <Appt appt={selectedAppt} refetchQueries={[{ query: ALL_APPTS }]} onDelete={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;