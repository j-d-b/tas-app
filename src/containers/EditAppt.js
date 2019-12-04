import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { getApptDate, getFriendlyActionType, buildActionDetailsInput } from '../utils';
import EditApptDetails from '../components/EditApptDetails';
import EditAction from '../components/EditAction';
import { FormButton } from '../components/Form';
import { ErrorMessage, SuccessMessage } from '../components/ResponseMessage';

const UPDATE_APPT = gql`
  mutation UpdateAppt ($input: UpdateApptDetailsInput!) {
    updateApptDetails(input: $input) {
      id
    }
  }
`;

const EditAppt = ({ appt, isCustomer, refetchQueries, onCompleted }) => {
  const [edits, setEdits] = useState(appt);
  const [updateAppt, { data, error, loading}] = useMutation(
    UPDATE_APPT,
    { 
      refetchQueries,
      onCompleted: () => onCompleted()
    }
  );

  const onSubmit = e => {
    e.preventDefault();
    updateAppt({
      variables: {
        input: {
          id: appt.id,
          comment: edits.comment,
          notifyMobileNumber: edits.notifyMobileNumber,
          licensePlateNumber: edits.licensePlateNumber,
          actionDetails: edits.actions.map(action => (
            {
              id: action.id,
              ...(buildActionDetailsInput(action))
            }
          ))
        }
      }
    })
  };

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Appointment: {appt.id}</h1>

      <form name="appt" onSubmit={onSubmit}>
        <h2>Details</h2>

        <EditApptDetails appt={edits} onEdit={setEdits} />

        {edits.actions.map((action, index) => (
          <div key={action.id}>
            <h2>Action {index + 1}: {getFriendlyActionType(action.type, isCustomer ? 'CUSTOMER' : 'OPERATOR')}</h2>
            <EditAction
              action={action}
              onEdit={editedAction => {
                const newActions = edits.actions.map((a, i) => i === index ? editedAction : a);
                setEdits({ ...edits, actions: newActions });
              }}
            />
          </div>
        ))}

        <FormButton 
          type="button"
          style={{ width: 'calc(50% - 0.25rem)', marginRight: '0.25rem', marginTop: '1rem' }}
          variety="PRIMARY"
          onClick={() => onCompleted()}
        >Cancel</FormButton>

        <FormButton
          style={{ width: '50%' }}
          type="submit"
          variety="SUCCESS"
          disabled={loading}
        >{loading ? 'Saving...' : 'Save'}</FormButton>

        <div style={{ textAlign: 'center' }}>
          {error && <ErrorMessage error={error} />}
          {data && <SuccessMessage>Changes saved successfully!</SuccessMessage>}
        </div>
      </form>
    </div>
  );
};

export default EditAppt;