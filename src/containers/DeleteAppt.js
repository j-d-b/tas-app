import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { getDateFromTimeSlot } from '../helpers';
import { ErrorMessage } from '../components/ResponseMessage';
import { FormButton } from '../components/Form';

const DELETE_APPT = gql`
  mutation DeleteAppt ($id: ID!) {
    deleteAppt(input: { id: $id })
  }
`;

const DeleteAppt = ({ appt, onDelete, onCancel, refetchQueries }) => {
  const [deleteAppt, { error, loading }] = useMutation(DELETE_APPT, { refetchQueries, onCompleted: onDelete });

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ marginTop: 0 }}>Confirm Deletion</h1>
      <p>Are you sure you want to delete your appointment for <strong>{getDateFromTimeSlot(appt.timeSlot).toDateString()}</strong> at <strong>{appt.arrivalWindow}</strong>?</p>
      <FormButton
        type="button"
        style={{ width: 'calc(50% - 0.25rem)', marginRight: '0.25rem' }}
        onClick={onCancel}
      >Cancel</FormButton>
      <FormButton 
        type="button"
        style={{ width: '50%' }}
        variety="DANGER"
        disabled={loading}
        onClick={() => !loading && deleteAppt({ variables: { id: appt.id } })}
      >{loading ? 'Deleting...' : 'Delete'}</FormButton>

      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default DeleteAppt;