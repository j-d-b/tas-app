import React, { useState, useEffect, useRef } from 'react';
import { format, isAfter } from 'date-fns/esm';

import { getHourString, getDateFromTimeslot, isTimeSlotEqual } from '../utils';
import './RestrictionsTable.scss';

const ALL_HOURS_IN_DAY = new Array(24).fill(0).map((_, i) => i);

const ALL_WEEKDAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY'
];

const RestrictionsTableCellInput = ({ value, setValue, onBlur }) => {
  const inputEl = useRef(null);

  useEffect(() => inputEl.current.select(), []);

  return (
    <input
      name="gateCapacityValue"
      ref={inputEl}
      className="restrictions-table-input-cell"
      value={value}
      pattern="[0-9]+$"
      maxLength="4"
      type="text"
      step="1"
      onBlur={onBlur}
      onChange={e => {
        const { target } = e;
        if (/[0-9]+$/.test(target.value) || !target.value) {
          setValue(target.value);
        }
      }}
    />
  );
}

const RestrictionsTable = ({ dates, addRestriction, deleteRestriction, getValueStyle, getValue }) => {
  const [selectedTimeSlot, selectTimeSlot] = useState(null);
  const [editableValue, setEditableValue] = useState('');

  return (
    <div>
      <div className="restrictions-table-wrapper">
        <div className="restrictions-table" style={{ gridTemplateRows: `min-content repeat(${dates ? 8 : 7}, 3rem)` }}>
          {ALL_HOURS_IN_DAY.map((hour, i) => <div style={{ gridColumnStart: i + 2}} className="restrictions-table-hour" key={hour}>{getHourString(hour)}</div>)}
          
          {dates && dates.map((date, i) => (
            <React.Fragment key={date}>
              <div style={{ gridRowStart: i + 2 }} className="restrictions-table-date">{format(date, 'MMM d, yyyy (EEE)')}</div>
              
              {ALL_HOURS_IN_DAY.map((hour, j) => {
                const timeSlot = { date: format(date, 'yyyy-MM-dd'), hour };
                const isUpcoming = isAfter(getDateFromTimeslot(timeSlot), new Date());
                const isSelected = selectedTimeSlot && isTimeSlotEqual(timeSlot, selectedTimeSlot);
                const { value, style } = getValueStyle(timeSlot);

                if (!isUpcoming) return <div key={date.toString() + hour} className="restrictions-table-cell restrictions-table-cell--disabled">{value}</div>;

                return (
                  <div
                    {...(style && { style })}
                    key={date.toString() + hour}
                    aria-label={`${timeSlot.date}, ${hour}`}
                    tabIndex="0"
                    onKeyDown={e => {
                      const code = e.keyCode || e.charCode;
                      if (!isSelected) {
                        if (code === 13) {
                          setEditableValue(value);
                          selectTimeSlot(timeSlot);
                        }
                      } else {
                        if (code === 13) {
                          if (editableValue === '') {
                            deleteRestriction(selectedTimeSlot);
                          } else {
                            addRestriction(selectedTimeSlot, editableValue);
                          }
                          selectTimeSlot(null);
                        }
                      }
                    }}
                    className={`restrictions-table-cell${isSelected ? ' restrictions-table-cell--selected' : ''}`}
                    onClick={() => {
                      setEditableValue(value);
                      selectTimeSlot(timeSlot);
                    }}
                  >
                    {isSelected
                      ? <RestrictionsTableCellInput
                          value={editableValue}
                          setValue={setEditableValue}
                          onBlur={() => selectTimeSlot(null)}
                        />
                      : value
                    }
                  </div>
                );
              })}
            </React.Fragment>
          ))}

          {!dates && ALL_WEEKDAYS.map((dayOfWeek, i) => (
            <React.Fragment key={dayOfWeek}>
              <div style={{ gridRowStart: i + 2, textTransform: 'capitalize' }} className="restrictions-table-date">{dayOfWeek.toLowerCase()}</div>
              
              {ALL_HOURS_IN_DAY.map((hour, j) => {
                const timeSlot = { dayOfWeek, hour };
                const isSelected = selectedTimeSlot && (selectedTimeSlot.dayOfWeek === dayOfWeek && selectedTimeSlot.hour === hour);
                const value = getValue(timeSlot);

                return (
                  <div
                    key={dayOfWeek + hour}
                    aria-label={`${dayOfWeek}, ${hour}`}
                    tabIndex="0"
                    onKeyDown={e => {
                      const code = e.keyCode || e.charCode;
                      if (!isSelected) {
                        if (code === 13) {
                          setEditableValue(value);
                          selectTimeSlot(timeSlot);
                        }
                      } else {
                        if (code === 13) {
                          if (editableValue === '') {
                            deleteRestriction(selectedTimeSlot);
                          } else {
                            addRestriction(selectedTimeSlot, editableValue);
                          }
                          selectTimeSlot(null);
                        }
                      }
                    }}
                    className={`restrictions-table-cell${isSelected ? ' restrictions-table-cell--selected' : ''}`}
                    onClick={() => {
                      setEditableValue(value);
                      selectTimeSlot(timeSlot);
                    }}
                  >
                    {isSelected
                      ? <RestrictionsTableCellInput
                          value={editableValue}
                          setValue={setEditableValue}
                          onBlur={() => selectTimeSlot(null)}
                        />
                      : value
                    }
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestrictionsTable;