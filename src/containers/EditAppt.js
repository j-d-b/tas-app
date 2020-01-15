import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { getPrettyActionType } from '../helpers';
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

const buildActionDetailsInput = action => {
  switch (action.type) {
    case 'IMPORT_FULL': {
      return {
        importFull: {
          formNumber705: action.formNumber705,
          containerId: action.containerId,
          containerType: action.containerType
        }
      };
    }
    case 'STORAGE_EMPTY': {
      return {
        storageEmpty: {
          containerType: action.containerType,
          emptyForCityFormNumber: action.emptyForCityFormNumber
        }
      };
    }
    case 'EXPORT_FULL': {
      return {
        exportFull: {
          containerId: action.containerId,
          containerType: action.containerType,
          containerWeight: action.containerWeight,
          shippingLine: action.shippingLine,
          bookingNumber: action.bookingNumber
        }
      };
    }
    case 'EXPORT_EMPTY': {
      return {
        exportEmpty: {
          containerId: action.containerId,
          containerType: action.containerType
        }
      };
    }
    default: return {};
  }
};

const EditAppt = ({ appt, isCustomer, refetchQueries, onCompleted }) => {
  const [edits, setEdits] = useState(appt);
  const [updateAppt, { data, error, loading }] = useMutation(
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
    });
  };

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Appointment: {appt.id}</h1>

      <form name="appt" onSubmit={onSubmit}>
        <h2>Details</h2>

        <EditApptDetails appt={edits} onEdit={setEdits} />

        {edits.actions.map((action, index) => (
          <div key={action.id}>
            <h2>Action {index + 1}: {getPrettyActionType(action.type, isCustomer ? 'CUSTOMER' : 'OPERATOR')}</h2>
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