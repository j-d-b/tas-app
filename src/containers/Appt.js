import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';

import './Appt.scss';
import Action from '../components/Action';
import { getApptDate, getFriendlyActionType } from '../utils';
import RescheduleAppt from './RescheduleAppt';
import DeleteAppt from './DeleteAppt';
import EditAppt from './EditAppt';
import { FormButton } from '../components/Form';
import { ErrorMessage } from '../components/ResponseMessage';

const APPT = gql`
  query Appt ($id: ID!) {
    appt (input: { id: $id }) {
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

const Appt = ({ apptId, isCustomer, refetchQueries, onDelete, isReadOnly }) => {
  const { data, error, loading } = useQuery(APPT, { variables: { id: apptId } });

  const [selectedAction, selectAction] = useState(null);

  if (loading) return <div>Loading appointment...</div>;
  if (error) return <ErrorMessage error={error} />;

  const { appt } = data;

  switch (selectedAction) {
    case 'DELETE': return (
      <DeleteAppt
        appt={appt}
        onCancel={() => selectAction(null)}
        onDelete={onDelete}
        refetchQueries={refetchQueries}
      />
    );
    case 'RESCHEDULE': return (
      <RescheduleAppt
        appt={appt}
        onCompleted={() => selectAction(null)}
        refetchQueries={[...refetchQueries, { query: APPT, variables: { id: apptId } }]}
      />
    );
    case 'EDIT': return (
      <EditAppt
        appt={appt}
        onCompleted={() => selectAction(null)}
        refetchQueries={[...refetchQueries, { query: APPT, variables: { id: apptId } }]}
      />
    );
    default: return (
      <div>
        <h1 style={{ marginTop: 0 }}>Appointment: {appt.id}</h1>
  
        <h2 style={{ marginBottom: '0.5rem' }}>Details</h2>
  
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <th>Date</th>
              <td>{format(getApptDate(appt), `iii, MMM d, yyyy`)}</td>
            </tr>
            <tr>
              <th>{isCustomer ? 'Time' : 'Arrival Window'}</th>
              <td>{appt.arrivalWindow}</td>
            </tr>
            <tr>
              <th>Comment</th>
              <td>{appt.comment}</td>
            </tr>
            <tr>
              <th>Driver Mobile Number</th>
              <td>{appt.notifyMobileNumber}</td>
            </tr>
            <tr>
              <th>Company</th>
              <td>{appt.licensePlateNumber}</td>
            </tr>
          </tbody>
        </table>
  
        {!isCustomer && (
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Customer</h2>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <th>Email</th>
                  <td>{appt.user.email}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{appt.user.name}</td>
                </tr>
                <tr>
                  <th>Company</th>
                  <td>{appt.user.company}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
  
        {appt.actions.map((action, index) => (
          <div key={action.id}>
            <h2 style={{ marginBottom: '0.5rem' }}>Action {index + 1}: {getFriendlyActionType(action.type, isCustomer ? 'CUSTOMER' : 'OPERATOR')}</h2>
            <Action action={action} />
          </div>
        ))}
  
        {!isReadOnly && (
          <div className="appt-button-row">
            <FormButton
              type="button"
              variety="DANGER"
              onClick={() => selectAction('DELETE')}
            >Delete</FormButton>
  
            <FormButton
              type="button"
              onClick={() => selectAction('RESCHEDULE')}
            >Reschedule</FormButton>
  
            <FormButton
              type="button"
              onClick={() => selectAction('EDIT')}
            >Edit</FormButton>
          </div>
        )}
      </div>
    );
  }
};

export default Appt;