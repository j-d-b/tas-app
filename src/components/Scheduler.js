import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import './Scheduler.scss';
import { getFriendlyActionType, calculateApptTFU, getHourString } from '../utils';
import EditApptDetails from './EditApptDetails';
import EditAction from './EditAction';
import FormButton from './FormButton';
import FormSelect from './FormSelect';
import RightAlign from './RightAlign';
import ScheduleAppt from './ScheduleAppt';

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
  <div style={{ marginTop: '33%', textAlign: 'center' }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 300 }}>Schedule an Appointment</h1>
    <FormButton onClick={onStart}>Start</FormButton>
  </div>
);

const ChooseActionType = ({ action, selectActionType, goToNextPage, actionNumber, options }) => (
  <form name="actionType" onSubmit={e => {
    e.preventDefault();
    goToNextPage();
  }}>
    <h2>Choose Action {actionNumber > 1 ? actionNumber  : ''} Type</h2>
    <label htmlFor="actionType">Select Action Type</label>
    <FormSelect
      id="actionType"
      value={action.type}
      onChange={e => selectActionType(e.target.value)}
      options={options}
      required
    />

    {actionNumber  === 1 && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}><strong>Note:</strong> You will have the option to add additional actions to this appointment later</p>}

    <RightAlign>
      <FormButton type="submit">Continue</FormButton>
    </RightAlign>
  </form>
);

const INIT_APPT = { actions: [{ type: '' }] };

const Scheduler = ({ refetchQueries }) => {
  const [page, setPage] = useState(0);
  const [numActions, setNumActions] = useState(1);
  const [newAppt, setNewAppt] = useState(INIT_APPT);
  const [addAppt, { data, error, loading }] = useMutation(
    ADD_APPT,
    { 
      refetchQueries,
      onCompleted: () => {
        setPage(7);
        setNewAppt(INIT_APPT);
        setNumActions(1);
      }
    }
  );

  return (
    <div className="scheduler">
      {/* <div>{JSON.stringify(newAppt)}</div> */}
      {(() => {
        switch (page) {
          case 0: return <Start onStart={() => setPage(1)} />;
          case 1: {
            const allOptions = [
              { name: 'Pick Up Full', value: 'IMPORT_FULL' },
              { name: 'Pick Up Empty', value: 'STORAGE_EMPTY' },
              { name: 'Drop Off Full', value: 'EXPORT_FULL' },
              { name: 'Drop Off Empty', value: 'EXPORT_EMPTY' }
            ];

            const isValidOption = option => {
              const isImportType = type => type && (type === 'IMPORT_FULL' || type === 'STORAGE_EMPTY');
              const isExportType = type => type && (type === 'EXPORT_FULL' || type === 'EXPORT_EMPTY');

              if (newAppt.actions.length <= 1) return true;

              const numImports = newAppt.actions.reduce((count, { type }) => count + (isImportType(type) ? 1 : 0), 0);
              const numExports = newAppt.actions.reduce((count, { type }) => count + (isExportType(type) ? 1 : 0), 0);

              if (numImports >= 2) return !isImportType(option.value);
              if (numExports >= 2) return !isExportType(option.value);

              return true;
            };

            return (
              <ChooseActionType
                actionNumber={numActions}
                options={allOptions.filter(isValidOption)}
                action={newAppt.actions[numActions - 1]}
                selectActionType={actionType => {
                  const newActions = [...newAppt.actions];
                  newActions[numActions - 1].type = actionType;
                  setNewAppt({ ...newAppt, actions: newActions });
                }}
                goToNextPage={() => setPage(2)}
              />
            );
          }
          case 2: return (
            <form 
              name="actionDetails" 
              onSubmit={e => {
                e.preventDefault();
                setPage(3);
              }}
            >
              <h2>Enter Action Details</h2>

              <EditAction
                isNew
                action={newAppt.actions[numActions - 1]}
                onEdit={editedAction => {
                  const newActions = [...newAppt.actions];
                  newActions[numActions - 1] = { ...newAppt.actions[numActions - 1], ...editedAction };
                  setNewAppt({ ...newAppt, actions: newActions });
                }}
              />

              <RightAlign>
                <FormButton type="submit">Continue</FormButton>
              </RightAlign>
            </form>
          );
          case 3: return (
            <div>
              <h2>Current Actions</h2>
              <ul>
                {newAppt.actions.map((action, i) => <li key={i}><strong>{getFriendlyActionType(action.type)}</strong> {action.containerId ? `(CID: ${action.containerId})` : ''}</li>)}
              </ul>
              <RightAlign>
                {calculateApptTFU(newAppt) < 80 && (
                  <FormButton 
                    onClick={() => {
                      setNewAppt({ ...newAppt, actions: [...newAppt.actions, {}]});
                      setNumActions(numActions + 1);
                      setPage(1);
                    }}
                    style={{ marginRight: '0.5rem' }}
                  >Add Another Action</FormButton>
                )}
                <FormButton onClick={() => setPage(4)}>Proceed to Booking</FormButton>
              </RightAlign>
            </div>
          );
          case 4: return (
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
          case 5: return (
            <div>
              <h2>Select an Appointment Time Slot</h2>
              <ScheduleAppt
                appt={newAppt}
                setTimeSlot={timeSlot => setNewAppt({ ...newAppt, timeSlot })}
              />
              <FormButton onClick={() => newAppt.timeSlot && setPage(6)} disabled={!newAppt.timeSlot}>Confirm</FormButton>
            </div>
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
              <FormButton onClick={() => setPage(1)}>Book Another Appointment</FormButton>
            </div>
          );
          default: return <Start onStart={() => setPage(1)} />
        }
      })()}
    </div>
  );
};

export default Scheduler;
