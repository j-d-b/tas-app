import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import './Scheduler.scss';
import { getFriendlyActionType, calculateApptTFU, getHourString, containerSizeToTFU } from '../utils';
import EditApptDetails from '../components/EditApptDetails';
import EditAction from '../components/EditAction';
import { FormButton, FormSelect } from '../components/Form';
import RightAlign from '../components/RightAlign';
import ScheduleAppt from './ScheduleAppt';

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
  <div style={{ textAlign: 'center' }}>
    <h1 style={{ fontSize: '3.5rem', fontWeight: 300 }}>Schedule an Appointment</h1>
    <FormButton style={{ width: '100%' }} onClick={onStart}>Start</FormButton>
  </div>
);

const getActionTypeOptions = (appt, currActionIndex) => {
  const allOptions = [
    { name: 'Pick Up Full', value: 'IMPORT_FULL' },
    { name: 'Pick Up Empty', value: 'STORAGE_EMPTY' },
    { name: 'Drop Off Full', value: 'EXPORT_FULL' },
    { name: 'Drop Off Empty', value: 'EXPORT_EMPTY' }
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

const Scheduler = ({ refetchQueries }) => {
  const [page, setPage] = useState(0);
  const [currActionIndex, setCurrActionIndex] = useState(0);
  const [newAppt, setNewAppt] = useState(INIT_APPT);
  const [addAppt, { data, error, loading }] = useMutation(
    ADD_APPT,
    { 
      refetchQueries,
      onCompleted: () => {
        setPage(7);
        setNewAppt({});
        setCurrActionIndex(0);
      }
    }
  );

  return (
    <div className="scheduler">
      {(() => {
        switch (page) {
          case 0: return <Start onStart={() => setPage(1)} />;
          case 1: return (
            <form name="actionType" onSubmit={e => {
              e.preventDefault();
              setPage(2);
            }}>
              <h2>Select Action {currActionIndex ? currActionIndex + 1 : ''} Type</h2>

              <label htmlFor="actionType">Action Type</label>
              <FormSelect
                name="actionType"
                id="actionType"
                value={newAppt.actions[currActionIndex].type}
                onChange={e => {
                  const newActions = [...newAppt.actions];
                  newActions[currActionIndex].type = e.target.value;
                  setNewAppt({ ...newAppt, actions: newActions });
                }}
                options={getActionTypeOptions(newAppt, currActionIndex)}
                required
              />

              {currActionIndex === 0 && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}><strong>Note:</strong> You will have the option to add additional actions to this appointment later</p>}

              <RightAlign>
                <FormButton
                  type="button"
                  style={{ marginRight: '0.5rem' }}
                  onClick={currActionIndex === 0
                    ? () => {
                        setPage(0);
                        setNewAppt(INIT_APPT);
                        setCurrActionIndex(0);
                      }
                    : () => {
                        setPage(3);
                        setNewAppt({ ...newAppt, actions: newAppt.actions.filter((a, i) => i !== currActionIndex) });
                        setCurrActionIndex(currActionIndex - 1);
                      }
                  }
                >{currActionIndex === 0 ? 'Cancel' : 'Back'}</FormButton>
                <FormButton type="submit">Continue</FormButton>
              </RightAlign>
            </form>
          );
          case 2: return (
            <form 
              name="actionDetails" 
              onSubmit={e => {
                e.preventDefault();
                setPage(3);
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

              <RightAlign>
                <FormButton type="button" style={{ marginRight: '0.5rem' }} onClick={() => setPage(1)}>Back</FormButton>
                <FormButton type="submit">Continue</FormButton>
              </RightAlign>
            </form>
          );
          case 3: return (
            <form
              name="currentActions"
              onSubmit={e => {
                e.preventDefault();
                setPage(4);
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
                      setPage(1);
                    }}
                    style={{ marginRight: '0.5rem' }}
                  >Add Another Action</FormButton>
                )}
                <FormButton type="submit">Proceed to Booking</FormButton>
              </RightAlign>
            </form>
          );
          case 4: return (
            <div>
              <h2>Select an Appointment Time Slot</h2>
              <ScheduleAppt
                appt={newAppt}
                setTimeSlot={timeSlot => setNewAppt({ ...newAppt, timeSlot })}
              />
              <FormButton onClick={() => newAppt.timeSlot && setPage(6)} disabled={!newAppt.timeSlot}>Confirm Time Slot</FormButton>
            </div>
          );
          case 5: return (
            <form name="apptDetails">
              <h2>Enter Appointment Details</h2> 
              <EditApptDetails
                appt={newAppt}
                onEdit={setNewAppt}
              />

              <RightAlign>
                <FormButton onClick={() => setPage(5)}>Proceed to Booking</FormButton>
              </RightAlign>
            </form>
          );
          case 6: return (
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
              <div>{newAppt.timeSlot.date}</div>
              <div>{getHourString(newAppt.timeSlot.hour)}</div>
              <p><strong>Note:</strong> You will be assigned a specific <strong>TODO</strong> size window to arrive during within the selected timeslot</p>

              <RightAlign>
                <FormButton type="submit" disabled={loading}>{loading ? 'Booking...' : 'Book Appointment'}</FormButton>
                <div>{error && error.toString()}</div>
              </RightAlign>
            </form>
          );
          case 7: return (
            <div>
              <h1>Appointment Booked Successfully!</h1>
              <p>Appointment Date: {data.addAppt.timeSlot.date}</p>
              <p>Please arrive between {data.addAppt.arrivalWindow}</p>
              <RightAlign>
                <FormButton onClick={() => setPage(1)}>Book Another Appointment</FormButton>
              </RightAlign>
            </div>
          );
          default: return <Start onStart={() => setPage(1)} />
        }
      })()}
    </div>
  );
};

export default Scheduler;
