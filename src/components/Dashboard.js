import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { getDateFromTimeslot } from '../utils';
import './Dashboard.scss';
import OrganizeBox from './OrganizeBox';

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

const satisfiesSearch = search => appt => (
  !search
    || appt.id.includes(search)
    || appt.user.name.toLowerCase().includes(search.toLowerCase())
    || appt.user.company.toLowerCase().includes(search.toLowerCase())
    || appt.actions.reduce((matchesSearch, { containerId }) => matchesSearch || (containerId && containerId.includes(search)), false)
);

const satisfiesFilters = filters => appt => (
  filters.type === 'ALL'
    || appt.actions.reduce((matchesType, action) => matchesType || action.type === filters.type, false)
);

const createSort = sort => (apptA, apptB) => {
  switch (sort.by) {
    case ('TIME_SLOT'): {
      const dateA = getDateFromTimeslot(apptA.timeSlot);
      const dateB = getDateFromTimeslot(apptB.timeSlot);
      if (dateA > dateB) return sort.direction === 'ASCENDING' ? 1 : -1;
      if (dateB > dateA) return sort.direction === 'ASCENDING' ? -1 : 1;
      return 0;
    }
    case ('CUSTOMER'): {
      if (apptA.user.name > apptB.user.name) return sort.direction === 'ASCENDING' ? 1 : -1;
      if (apptB.user.name > apptA.user.name) return sort.direction === 'ASCENDING' ? -1 : 1;
      return 0;
    }
    case ('COMPANY'): {
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
        {appts.map(({user}, i) => <div key={i}>{JSON.stringify(user)}</div>)}
      </div>
    </div>
  );

}

export default Dashboard;