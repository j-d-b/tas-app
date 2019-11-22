import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import './Scheduler.scss';
import { getFriendlyActionType, calculateApptTFU, getHourString, containerSizeToTFU } from '../utils';
import EditApptDetails from '../components/EditApptDetails';
import EditAction from '../components/EditAction';
import { FormButton, FormNote } from '../components/Form';
import RightAlign from '../components/RightAlign';
import { ErrorMessage } from '../components/ResponseMessage';
import ScheduleAppt from './ScheduleAppt';
import { ReactComponent as ImportFullIcon} from '../images/truck-import-full.svg';
import { ReactComponent as StorageEmptyIcon} from '../images/truck-storage-empty.svg';
import { ReactComponent as ExportFullIcon} from '../images/truck-export-full.svg';
import { ReactComponent as ExportEmptyIcon} from '../images/truck-export-empty.svg';

const MAX_TFU_PER_ACTION_CATEGORY = 40; // TODO, action category is 'import' or 'export'
const DEFAULT_ACTION_TFU = 40; // if containerSize is not defined

const ADD_APPT = gql`
  mutation AddAppt ($input: AddApptInput!) {
    addAppt (input: $input) {
      arrivalWindow
      timeSlot {
        date
        hour
      }
    }
  }
`;

// const MAX_TFU = gql`
//   {

//   }
// `; // TODO

// const ARRIVAL_WINDOW_SIZE = gql``; //TODO

const indexToNthString = index => {
  switch (index) {
    case 0: return 'First';
    case 1: return 'Second';
    case 2: return 'Third';
    case 3: return 'Fourth';
    default: return '';
  }
};

const buildAddActionInput = action => {
  switch (action.type) {
    case 'IMPORT_FULL': {
      return {
        type: 'IMPORT_FULL',
        importFull: {
          formNumber705: action.formNumber705,
          containerId: action.containerId
        }
      };
    }
    case 'STORAGE_EMPTY': {
      return {
        type: 'STORAGE_EMPTY',
        storageEmpty: {
          containerSize: action.containerSize,
          shippingLine: action.shippingLine,
          containerType: action.containerType,
          emptyForCityFormNumber: action.emptyForCityFormNumber
        }
      }
    }
    case 'EXPORT_FULL': {
      return {
        type: 'EXPORT_FULL',
        exportFull: {
          containerId: action.containerId,
          containerSize: action.containerSize,
          containerType: action.containerType,
          containerWeight: action.containerWeight,
          shippingLine: action.shippingLine,
          bookingNumber: action.bookingNumber
        }
      }
    }
    case 'EXPORT_EMPTY': {
      return {
        type: 'EXPORT_EMPTY',
        exportEmpty: {
          containerId: action.containerId,
          containerSize: action.containerSize,
          containerType: action.containerType,
          shippingLine: action.shippingLine
        }
      }
    }
    default: return {};
  }
};

const Start = ({ onStart }) => (
  <div className="start-page">
    <h1 className="start-page__title">BCTC Truck Appointment System Scheduler</h1>
    <p>Weclome to the appointment scheduler for the BCTC Truck Appointment System</p>
    <p>You will be able to schedule up to four container actions (pick up or drop off) per appointment, depending on container sizes</p>
    <p>Click the button below to begin</p>
    <FormButton className="start-page__button" onClick={onStart}>SCHEDULE AN APPOINTMENT</FormButton>
  </div>
);

const getActionTypeOptions = (appt, currActionIndex) => {
  const allOptions = [
    { IconComponent: ImportFullIcon, name: 'Pick Up Full Container', value: 'IMPORT_FULL' },
    { IconComponent: ExportFullIcon, name: 'Drop Off Full Container', value: 'EXPORT_FULL' },
    { IconComponent: StorageEmptyIcon, name: 'Pick Up Empty Container', value: 'STORAGE_EMPTY' },
    { IconComponent: ExportEmptyIcon, name: 'Drop Off Empty Container', value: 'EXPORT_EMPTY' }
  ];

  const isImportType = type => type === 'IMPORT_FULL' || type === 'STORAGE_EMPTY';
  const isExportType = type => type === 'EXPORT_FULL' || type === 'EXPORT_EMPTY';

  const importTFU = appt.actions.reduce((count, { type, containerSize }, i) => (
    type && isImportType(type) && currActionIndex !== i
      ? count + (containerSize ? containerSizeToTFU(containerSize) : DEFAULT_ACTION_TFU) // checking if it's defined
      : count
  ), 0);

  const exportTFU = appt.actions.reduce((count, { type, containerSize }, i) => (
    type && isExportType(type) && currActionIndex !== i
      ? count + (containerSize ? containerSizeToTFU(containerSize) : DEFAULT_ACTION_TFU) // checking if it's defined
      : count
  ), 0);

  const canImport = importTFU < MAX_TFU_PER_ACTION_CATEGORY;
  const canExport = exportTFU < MAX_TFU_PER_ACTION_CATEGORY;

  return allOptions.filter(({ value }) => isImportType(value) ? canImport : canExport);
};

const getContainerSizeOptions = (appt, currActionIndex) => {
  const allOptions = [
    { name: 'Twenty Foot', value: 'TWENTYFOOT' },
    { name: 'Forty Foot', value: 'FORTYFOOT' }
  ];

  const isImportType = type => type === 'IMPORT_FULL' || type === 'STORAGE_EMPTY';
  const isExportType = type => type === 'EXPORT_FULL' || type === 'EXPORT_EMPTY';

  const importTFU = appt.actions.reduce((count, { type, containerSize }, i) => (
    type && isImportType(type) && currActionIndex !== i
      ? count + (containerSize ? containerSizeToTFU(containerSize) : DEFAULT_ACTION_TFU) // checking if it's defined
      : count
  ), 0);

  const exportTFU = appt.actions.reduce((count, { type, containerSize }, i) => (
    type && isExportType(type) && currActionIndex !== i
      ? count + (containerSize ? containerSizeToTFU(containerSize) : DEFAULT_ACTION_TFU) // checking if it's defined
      : count
  ), 0);

  const remainingTFU = MAX_TFU_PER_ACTION_CATEGORY - (isImportType(appt.actions[currActionIndex].type) ? importTFU : exportTFU);

  return allOptions.filter(({ value }) => containerSizeToTFU(value) <= remainingTFU);
};

const INIT_APPT = { actions: [{ type: '' }] };

const Scheduler = () => {
  const [page, setPage] = useState('START');
  const [currActionIndex, setCurrActionIndex] = useState(0);
  const [selectedTimeSlot, selectTimeSlot] = useState(null);
  const [isSelectedTimeSlotValid, setIsSelectedTimeSlotValid] = useState(false);
  const [newAppt, setNewAppt] = useState({ ...INIT_APPT });
  const [addAppt, { data, error, loading }] = useMutation(
    ADD_APPT,
    { 
      onCompleted: () => {
        setPage('BOOKING_SUCCESS');
        setNewAppt({ ...INIT_APPT });
        setCurrActionIndex(0);
      }
    }
  );

  return (
    <div className="scheduler-page">
      <div className="scheduler">
        {(() => {
          switch (page) {
            case 'START': return <Start onStart={() => setPage('SELECT_ACTION_TYPE')} />;
            case 'SELECT_ACTION_TYPE': return (
              <form name="actionType" onSubmit={e => {
                e.preventDefault();
                setPage('ENTER_ACTION_DETAILS');
              }}>
                <h2 style={{ marginBottom: '0.5rem' }}>
                  <label htmlFor="actionType">Select  {currActionIndex ? indexToNthString(currActionIndex) : ''} Action Type</label>
                </h2>

                <div className="action-type-select">
                  {getActionTypeOptions(newAppt, currActionIndex).map(({ IconComponent, name, value }) => (
                    <div
                      key={value}
                      className={newAppt.actions[currActionIndex].type === value 
                        ? 'action-type-select__item action-type-select__item--selected'
                        : 'action-type-select__item'
                      }
                      onClick={() => {
                        const newActions = [...newAppt.actions];
                        newActions[currActionIndex].type = value;
                        setNewAppt({ ...newAppt, actions: newActions });
                      }}
                    >
                      <div className="action-type-select__icon">
                        <IconComponent title={name} />
                      </div>
                      <div className="action-type-select__name">{name}</div>
                    </div>
                  ))}
                </div>

                {currActionIndex === 0 && <FormNote>You will have the option to add additional actions to this appointment later</FormNote>}

                <RightAlign>
                  <FormButton
                    type="button"
                    style={{ marginRight: '0.5rem' }}
                    onClick={currActionIndex === 0
                      ? () => {
                          setPage('START');
                          setNewAppt(INIT_APPT);
                          setCurrActionIndex(0);
                        }
                      : () => {
                          setPage('ENTER_ACTION_DETAILS');
                          setNewAppt({ ...newAppt, actions: newAppt.actions.filter((a, i) => i !== currActionIndex) });
                          setCurrActionIndex(currActionIndex - 1);
                        }
                    }
                  >{currActionIndex === 0 ? 'Cancel' : 'Back'}</FormButton>
                  <FormButton disabled={!newAppt.actions[currActionIndex].type} type="submit">Continue</FormButton>
                </RightAlign>
              </form>
            );
            case 'ENTER_ACTION_DETAILS': return (
              <form 
                name="actionDetails" 
                onSubmit={e => {
                  e.preventDefault();
                  setPage('REVIEW_ACTIONS');
                }}
              >
                <h2>Enter Action {currActionIndex === 0 ? '' : currActionIndex + 1} Details</h2>
                <EditAction
                  isNew
                  action={newAppt.actions[currActionIndex]}
                  onEdit={editedAction => {
                    const newActions = [...newAppt.actions];
                    newActions[currActionIndex] = { ...newAppt.actions[currActionIndex], ...editedAction };
                    setNewAppt({ ...newAppt, actions: newActions });
                  }}
                  containerSizeOptions={getContainerSizeOptions(newAppt, currActionIndex)}
                />

                <FormNote>* indicates a required field</FormNote>

                <RightAlign>
                  <FormButton type="button" style={{ marginRight: '0.5rem' }} onClick={() => setPage('SELECT_ACTION_TYPE')}>Back</FormButton>
                  <FormButton type="submit">Continue</FormButton>
                </RightAlign>
              </form>
            );
            case 'REVIEW_ACTIONS': return (
              <form
                name="currentActions"
                onSubmit={e => {
                  e.preventDefault();
                  setPage('SELECT_TIME_SLOT');
                }}
              >
                <h2>Current Actions</h2>
                <ul>
                  {newAppt.actions.map((action, i) => <li key={i}><strong>{getFriendlyActionType(action.type)}</strong> {action.containerId ? `(CID: ${action.containerId})` : ''}</li>)}
                </ul>
                <p><strong>Note: </strong>You will be able to review/edit all details prior to confirmation.</p>
                <RightAlign>
                  {calculateApptTFU(newAppt) < (MAX_TFU_PER_ACTION_CATEGORY * 2) && ( // TODO THIS VALUE
                    <FormButton 
                      type="button"
                      onClick={() => {
                        setNewAppt({ ...newAppt, actions: [...newAppt.actions, {}]});
                        setCurrActionIndex(currActionIndex + 1);
                        setPage('SELECT_ACTION_TYPE');
                      }}
                      style={{ marginRight: '0.5rem' }}
                    >Add Another Action</FormButton>
                  )}
                  <FormButton type="submit">Proceed to Booking</FormButton>
                </RightAlign>
              </form>
            );
            case 'SELECT_TIME_SLOT': return (
              <div>
                <h2>Select an Appointment Time Slot</h2>
                <p>After booking, you will be assigned a specific arrival time within the selected time slot</p>

                <ScheduleAppt
                  appt={newAppt}
                  selectTimeSlot={selectTimeSlot}
                  setIsValid={setIsSelectedTimeSlotValid}
                />
                <RightAlign>
                  <FormButton
                    onClick={() => {
                      if (selectedTimeSlot) {
                        setNewAppt({ ...newAppt, timeSlot: selectedTimeSlot });
                        setPage('REVIEW_APPOINTMENT');
                      }
                    }} 
                    disabled={!isSelectedTimeSlotValid}
                  >Confirm Time Slot</FormButton>
                </RightAlign>
              </div>
            );
            case 'REVIEW_APPOINTMENT': return (
              <form onSubmit={e => {
                e.preventDefault();
                addAppt({
                  variables: {
                    input: {
                      ...newAppt,
                      actions: newAppt.actions.map(buildAddActionInput)
                    } 
                  } 
                });
              }}>
                <h2>Review Appointment Details</h2>

                <EditApptDetails appt={newAppt} onEdit={setNewAppt} />

                {newAppt.actions.map((action, index) => (
                  <div key={index}>
                    <h3>Action {index + 1}: {getFriendlyActionType(action.type, 'CUSTOMER')}</h3>

                    <EditAction
                      action={action}
                      isNew
                      onEdit={editedAction => {
                        const newActions = newAppt.actions.map((a, i) => i === index ? editedAction : a);
                        setNewAppt({ ...newAppt, actions: newActions });
                      }}
                    />
                  </div>
                ))}

                <h3>Time Slot</h3>
                <p>{newAppt.timeSlot.date} at {getHourString(newAppt.timeSlot.hour)}</p>
                <p>After booking, you will be assigned a specific arrival time within the this time slot</p>

                <RightAlign>
                  <FormButton type="submit" disabled={loading}>{loading ? 'Booking...' : 'Book Appointment'}</FormButton>
                </RightAlign>

                <RightAlign>
                  {error && <ErrorMessage error={error} />}
                </RightAlign>
              </form>
            );
            case 'BOOKING_SUCCESS': return (
              <div>
                <h1>Appointment Booked Successfully!</h1>
                <p>Appointment Date: {data.addAppt.timeSlot.date}</p>
                <p>Please arrive between {data.addAppt.arrivalWindow}</p>
                <RightAlign>
                  <FormButton onClick={() => setPage('SELECT_ACTION_TYPE')}>Book Another Appointment</FormButton>
                </RightAlign>
              </div>
            );
            default: return <Start onStart={() => setPage('SELECT_ACTION_TYPE')} />
          }
        })()}
      </div>
    </div>
  );
};

export default Scheduler;
