import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import './Dashboard.scss';
import { getDateFromTimeslot } from '../utils';
import Modal from '../components/Modal';
import OrganizeBox from '../components/OrganizeBox';
import ApptCard from '../components/ApptCard';
import EditAppt from './EditAppt';

const ALL_APPTS = gql`
  {
    appts (input: {}) {
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
    <h1>No Matching Appointments</h1>
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
  || appt.actions.reduce((matchesSearch, { containerId }) => matchesSearch || (containerId && containerId.toLowerCase().includes(lowerCaseSearch)), false)
};

const satisfiesFilters = filters => appt => {
  const satisfiesType = filters.type === 'ALL'
    || appt.actions.reduce((matchesType, action) => matchesType || action.type === filters.type, false);

  const apptDate = getDateFromTimeslot(appt.timeSlot);

  const satisfiesFrom = !filters.from || apptDate >= filters.from;

  const satisfiesTo = !filters.to || apptDate <= filters.to;

  return satisfiesType && satisfiesFrom && satisfiesTo;
};

const createSort = sort => (apptA, apptB) => {
  switch (sort.by) {
    case 'TIME_SLOT': {
      const dateA = getDateFromTimeslot(apptA.timeSlot);
      const dateB = getDateFromTimeslot(apptB.timeSlot);
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
  const [selectedAppt, selectAppt] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(INIT_FILTERS);
  const [sort, setSort] = useState(INIT_SORT);
  const { data, error, loading } = useQuery(ALL_APPTS);

  const reset = () => {
    setSearch('');
    setFilters(INIT_FILTERS);
    setSort(INIT_SORT);
  };

  let appts;
  if (data) {
    appts = data.appts
      .filter(satisfiesSearch(search))
      .filter(satisfiesFilters(filters))
      .sort(createSort(sort));
  }

  return (
    <div className="dashboard-page">
      <div className="organize-box-col">
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

      <div className="appts-col">
        <div className="appts-container">
          {error && <div>{error.toString()}</div>}
          {loading && <div>Loading appointments...</div>}
          {data && (
            <>
              {!appts.length && <NoAppts />}
              {appts.map(appt => <ApptCard appt={appt} key={appt.id} onClick={() => selectAppt(appt)} />)}
            </>
          )}
        </div>
      </div>

      <Modal 
        isOpen={selectedAppt}
        closeModal={() => selectAppt(null)}
        title="Edit Appt"
      >
        <EditAppt appt={selectedAppt} refetchQueries={[{ query: ALL_APPTS }]} onDelete={() => selectAppt(null)} />
      </Modal>
    </div>
  );
}

export default Dashboard;