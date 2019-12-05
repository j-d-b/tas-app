import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import './Appt.scss';
import RescheduleAppt from './RescheduleAppt';
import DeleteAppt from './DeleteAppt';
import EditAppt from './EditAppt';
import ApptDetails from '../components/ApptDetails';
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
        <ApptDetails appt={appt} isCustomer={isCustomer} />

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