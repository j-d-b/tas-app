import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { getDateFromTimeslot } from '../utils';
import './Dashboard.scss';
import OrganizeBox from './OrganizeBox';
import Appt from './Appt';

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
        type
        containerId
      }
      licensePlateNumber
      notifyMobileNumber
      comment
    }
  }
`;

const INIT_FILTERS = {
  search: '',
  type: 'ALL',
  startDate: 'ANY',
  endDate: 'ANY'
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

const satisfiesFilters = filters => appt => (
  filters.type === 'ALL'
    || appt.actions.reduce((matchesType, action) => matchesType || action.type === filters.type, false)
);

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
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(INIT_FILTERS);
  const [sort, setSort] = useState(INIT_SORT);
  const { data, error, loading } = useQuery(ALL_APPTS);

  const reset = () => {
    setSearch('');
    setFilters(INIT_FILTERS);
    setSort(INIT_SORT);
  };

  if (error) return <div>{error.toString()}</div>;
  if (loading) return <div>Loading</div>;

  const appts = data.appts
    .filter(satisfiesSearch(search))
    .filter(satisfiesFilters(filters))
    .sort(createSort(sort));

  
  let pairedAppts = [];
  let i = 0;
  while (i < appts.length) {
    pairedAppts.push([appts[i], appts[i + 1]]);
    i += 2;
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
        <div className="appt-container">
          {appts.map(appt => <Appt appt={appt} key={appt.id} />)}
        </div>
        {/* {pairedAppts.map(([appt1, appt2]) => (
          <div className='appt-pair' + (' appt-pair--singlet')} key={appt1.id}>
            <Appt appt={appt1} />
            {appt2 && <Appt key={appt2.id} appt={appt2} />}
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default Dashboard;