import React from 'react';

import './OrganizeBox.scss';
import { FormInput, FormButton, FormSelect } from './Form';
import StyledDatePicker from './StyledDatePicker';

const OrganizeBox = ({ search, setSearch, filters, setFilters, sort, setSort, reset }) => (
  <div className="organize-box">
    <h1 className="organize-box__title">Organize</h1>
    <h2 className="organize-box__header" htmlFor="search">Search</h2>
    <FormInput
      id="search"
      name="search"
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Appt ID, container ID, name, company"
    />

    <hr/>

    <h2 className="organize-box__header">Filter</h2>

    <div className="organize-box__input-group">
      <label htmlFor="fromDateTime">From</label>
      <StyledDatePicker
        id="fromDateTime"
        selected={filters.fromDate}
        onChange={val => setFilters({ ...filters, fromDate: val })}
        placeholderText="No start date"
        popperPlacement="bottom"
        isClearable
        showTimeSelect
        timeIntervals={60}
        timeFormat="HH:mm"
        timeCaption="Hour"
        maxDate={filters.toDate}
      />
    </div>

    <div className="organize-box__input-group">
      <label htmlFor="toDateTime">To</label>
      <StyledDatePicker
        id="toDateTime"
        selected={filters.toDate}
        onChange={val => setFilters({ ...filters, toDate: val })}
        placeholderText="No end date"
        popperPlacement="bottom"
        isClearable
        showTimeSelect
        timeIntervals={60}
        timeFormat="HH:mm"
        timeCaption="Hour"
        minDate={filters.fromDate}
      />
    </div>

    <div className="organize-box__input-group">
      <label htmlFor="actionType">Type</label>
      <FormSelect
        name="actionType"
        id="actionType"
        value={filters.type}
        onChange={e => setFilters({ ...filters, type: e.target.value })}
        options={[
          { name: 'All', value: 'ALL' },
          { name: 'Import Full', value: 'IMPORT_FULL' },
          { name: 'Export Full', value: 'EXPORT_FULL' },
          { name: 'Storage Empty', value: 'STORAGE_EMPTY' },
          { name: 'Export Empty', value: 'EXPORT_EMPTY' }
        ]} 
      />
    </div>

    <hr/>

    <h2 className="organize-box__header">Sort</h2>

    <div className="organize-box__input-group">
      <label htmlFor="sortField">By</label>
      <FormSelect
        name="sortField"
        id="sortField"
        value={sort.by}
        onChange={e => setSort({ ...sort, by: e.target.value })}
        options={[
          { name: 'Time Slot', value: 'TIME_SLOT' },
          { name: 'Customer', value: 'CUSTOMER' },
          { name: 'Company', value: 'COMPANY' }
        ]}
      />
    </div>

    <div className="organize-box__input-group">
      <label htmlFor="sortDirection">Direction</label>
      <FormSelect
        name="sortDirection"
        id="sortDirection"
        value={sort.direction}
        onChange={e => setSort({ ...sort, direction: e.target.value })}
        options={[
          { name: 'Ascending', value: 'ASCENDING' },
          { name: 'Descending', value: 'DESCENDING' }
        ]}
      />
    </div>

    <FormButton
      type="button"
      onClick={reset}
      style={{ width: '100%', marginTop: '0.5rem' }}
    >
      Reset
    </FormButton>
  </div>
);

export default OrganizeBox;