import React, { useState, useRef } from 'react';
import { format, isAfter, addDays } from 'date-fns/esm';

import { getHourString, getDateFromTimeslot, isTimeSlotEqual } from '../utils';
import './RestrictionsTable.scss';
import { FormInput } from './Form';

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

const getNextTimeSlot = currTimeSlot => {
  if (currTimeSlot.hour === 23) {
    return { hour: 0, date: format(addDays(new Date(currTimeSlot.date)), 1) }
  }

  return { hour: currTimeSlot.hour + 1, date: currTimeSlot.date };
};

const InputBox = React.forwardRef(({ left, top, value, setValue, isOpen, onBlur, onEnter }, ref) => (
  <div
    id="input-box"
    className="input-box"
    style={{
      top: !isOpen ? '-10000px' : `calc(${top}px)`,
      left: !isOpen ? '-10000px' : `calc(${left}px + 3rem)`
    }}
  >
    <div className="input-box__triangle"></div>
    <div className="input-box__input-container">
      <FormInput
        id="newValue"
        onBlur={onBlur}
        name="newValue"
        type="number"
        min="0"
        style={{ margin: 0 }}
        value={value}
        ref={ref}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          const code = e.keyCode || e.charCode;
          if (code === 13) onEnter();
        }}
      />
    </div>
  </div>
));

const RestrictionsTableCell = ({ onClick, isSelected, isDisabled, children }) => (
  <div
    tabIndex={isDisabled ? '-1' : '0'}
    onKeyDown={e => {
      const code = e.keyCode || e.charCode;
      if (code === 13) onClick(e);
    }}
    className={`restrictions-table-cell ${isDisabled && 'restrictions-table-cell--disabled'} ${isSelected && 'restrictions-table-cell--selected'}`}
    onClick={e => !isDisabled && onClick(e)}
  >
    {children}
  </div>
);

const RestrictionsTable = ({ dates, addRestriction, deleteRestriction, isEdit, cellValueComponent: CellValue }) => {
  const [selectedTimeSlot, selectTimeSlot] = useState(null);
  const [editableValue, setEditableValue] = useState('');
  const [inputBoxPosition, setInputBoxPosition] = useState({ left: -200, top: -200 });
  const editableValueInputEl = useRef(null);

  return (
    <div>
      <div className="restrictions-table-wrapper">
        <div className="restrictions-table" style={{ gridTemplateRows: `min-content repeat(${isEdit ? 7 : 8}, 3rem)` }}>
          {ALL_HOURS_IN_DAY.map((hour, i) => <div style={{ gridColumnStart: i + 2}} className="restrictions-table-hour" key={hour}>{getHourString(hour)}</div>)}
          
          {!isEdit && dates.map((date, i) => (
            <React.Fragment key={date}>
              <div style={{ gridRowStart: i + 2 }} className="restrictions-table-date">{format(date, 'MMM d, yyyy (EEE)')}</div>
              
              {ALL_HOURS_IN_DAY.map((hour, j) => {
                const timeSlot = { date: format(date, 'yyyy-MM-dd'), hour };
                const isUpcoming = isAfter(getDateFromTimeslot(timeSlot), new Date());

                return (
                  <RestrictionsTableCell
                    key={date.toString() + hour}
                    style={{ gridRowStart: i + 2, gridColumnStart: j + 2}}
                    onClick={e => {
                      selectTimeSlot(timeSlot);
                      setEditableValue(editableValue);
                      setInputBoxPosition({ left: e.target.getBoundingClientRect().left, top: e.target.offsetTop });
                      editableValueInputEl.current.select();
                    }}
                    isSelected={selectedTimeSlot && isTimeSlotEqual(timeSlot, selectedTimeSlot)}
                    isDisabled={!isUpcoming}
                  >
                    <CellValue
                      timeSlot={timeSlot}
                      isSelected={selectedTimeSlot && isTimeSlotEqual(timeSlot, selectedTimeSlot)}
                      isDisabled={!isUpcoming}
                      editableValue={editableValue}
                    />
                  </RestrictionsTableCell>
                )
              })}
            </React.Fragment>
          ))}

          {isEdit && ALL_WEEKDAYS.map((dayOfWeek, i) => (
            <React.Fragment key={dayOfWeek}>
              <div style={{ gridRowStart: i + 2, textTransform: 'capitalize' }} className="restrictions-table-date">{dayOfWeek.toLowerCase()}</div>
              
              {ALL_HOURS_IN_DAY.map((hour, j) => {
                const timeSlot = { dayOfWeek, hour };

                return (
                  <RestrictionsTableCell
                    key={dayOfWeek + hour}
                    style={{ gridRowStart: i + 2, gridColumnStart: j + 2}}
                    onClick={e => {
                      selectTimeSlot(timeSlot);
                      setEditableValue(editableValue);
                      setInputBoxPosition({ left: e.target.getBoundingClientRect().left, top: e.target.offsetTop });
                      editableValueInputEl.current.select();
                    }}
                    isSelected={selectedTimeSlot && (timeSlot.dayOfWeek === selectedTimeSlot.dayOfWeek && timeSlot.hour === selectedTimeSlot.hour)}
                  >
                    <CellValue
                      timeSlot={timeSlot}
                      isSelected={selectedTimeSlot && (timeSlot.dayOfWeek === selectedTimeSlot.dayOfWeek && timeSlot.hour === selectedTimeSlot.hour)}
                      editableValue={editableValue}
                    />
                  </RestrictionsTableCell>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <InputBox
        left={inputBoxPosition.left}
        top={inputBoxPosition.top}
        onEnter={() => {
          if (editableValue === '') {
            deleteRestriction(selectedTimeSlot);
          } else {
            addRestriction(selectedTimeSlot, editableValue);
          }
          editableValueInputEl.current.blur();
          setEditableValue('');
          selectTimeSlot(null);
        }}
        onBlur={() => selectTimeSlot(null)}
        value={editableValue}
        setValue={setEditableValue}
        ref={editableValueInputEl}
        isOpen={selectedTimeSlot}
      />
    </div>

  );
};

export default RestrictionsTable;