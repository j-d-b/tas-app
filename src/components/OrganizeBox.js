import React from 'react';

import './OrganizeBox.scss';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormButton from './FormButton';
import StyledDatePicker from './StyledDatePicker';

const OrganizeBox = ({ search, setSearch, filters, setFilters, sort, setSort, reset }) => (
  <div className="organize-box">
    <h2 className="organize-box__title">Organize</h2>
    <h3 className="organize-box__header">Search</h3>
    <FormInput
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Appt ID, container ID, name, company"
    />

    <hr/>

    <h3 className="organize-box__header">Filter</h3>

    <div className="organize-box__input-group">
      <label>From</label>
      <StyledDatePicker
        selected={filters.from}
        onChange={val => setFilters({ ...filters, from: val })}
        placeholderText="No start date"
        popperPlacement="bottom"
        isClearable
        showTimeSelect
        timeIntervals={60}
        timeFormat="HH:mm"
        timeCaption="Hour"
        maxDate={filters.to}
      />
    </div>

    <div className="organize-box__input-group">
      <label>To</label>
      <StyledDatePicker
        selected={filters.to}
        onChange={val => setFilters({ ...filters, to: val })}
        placeholderText="No end date"
        popperPlacement="bottom"
        isClearable
        showTimeSelect
        timeIntervals={60}
        timeFormat="HH:mm"
        timeCaption="Hour"
        minDate={filters.from}
      />
    </div>

    <div className="organize-box__input-group">
      <label>Type</label>
      <FormSelect
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

    <h3 className="organize-box__header">Sort</h3>

    <div className="organize-box__input-group">
      <label>By</label>
      <FormSelect
        value={sort.field}
        onChange={e => setSort({ ...sort, by: e.target.value })}
        options={[
          { name: 'Time Slot', value: 'TIME_SLOT' },
          { name: 'Customer', value: 'CUSTOMER' },
          { name: 'Company', value: 'COMPANY' }
        ]}
      />
    </div>

    <div className="organize-box__input-group">
      <label>Direction</label>
      <FormSelect
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