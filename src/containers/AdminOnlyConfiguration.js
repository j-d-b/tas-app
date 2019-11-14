import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import RightAlign from '../components/RightAlign';
import { FormInput, FormSelect, FormGroup, FormNote, FormButton } from '../components/Form';
import { ErrorMessage, SuccessMessage } from '../components/ResponseMessage';

const DEFAULT_ALLOWED_APPTS_PER_HOUR = gql`
  { defaultAllowedApptsPerHour }
`;

const UPDATE_DEFAULT_ALLOWED = gql`
  mutation UpdateDefaultAllowed ($newValue: Int!) {
    updateDefaultAllowed(input: { defaultAllowed: $newValue })
  }
`;

const ARRIVAL_WINDOW_LENGTH = gql`
  { arrivalWindowLength }
`;

const UPDATE_ARRIVAL_WINDOW = gql`
  mutation UpdateArrivalWindow ($newValue: Int!) {
    updateArrivalWindowLength(input: { windowLength: $newValue })
  }
`;

const AdminOnlyConfiguration = () => {
  const [defaultAllowed, setDefaultAllowed] = useState('Loading...');
  const defaultAllowedResults = useQuery(DEFAULT_ALLOWED_APPTS_PER_HOUR);
  const [updateDefaultAllowed, updateDefaultAllowedResults] = useMutation(UPDATE_DEFAULT_ALLOWED, { refetchQueries: [{ query: DEFAULT_ALLOWED_APPTS_PER_HOUR }] });

  const [arrivalWindow, setArrivalWindow] = useState('');
  const arrivalWindowLengthResults = useQuery(ARRIVAL_WINDOW_LENGTH);
  const [updateArrivalWindow, updateArrivalWindowResults] = useMutation(UPDATE_ARRIVAL_WINDOW,  { refetchQueries: [{ query: DEFAULT_ALLOWED_APPTS_PER_HOUR }] });

  useEffect(() => {
    if (defaultAllowedResults.data) setDefaultAllowed(defaultAllowedResults.data.defaultAllowedApptsPerHour);
  }, [defaultAllowedResults]);

  useEffect(() => {
    if (arrivalWindowLengthResults.data) setArrivalWindow(arrivalWindowLengthResults.data.arrivalWindowLength);
  }, [arrivalWindowLengthResults]);

  return (
    <form name="adminConfig" onSubmit={e => {
      e.preventDefault();
      updateDefaultAllowed({ variables: { newValue: defaultAllowed } });
      updateArrivalWindow({ variables: { newValue: arrivalWindow } });
    }}> 
      <FormGroup>
        <label htmlFor="defaultAllowedApptsPerHour">Default Allowed Appointments Per Hour</label>
        <FormInput
          id="defaultAllowedApptsPerHour"
          name="defaultAllowedApptsPerHour"
          type="text"
          min="0"
          value={defaultAllowed}
          required
          disabled={!defaultAllowedResults.data}
          onChange={e => setDefaultAllowed(e.target.value)}
        />
        <FormNote>This value will be used as a fallback when there is no gate capacity value for a given time slot</FormNote>
      </FormGroup>

      <FormGroup>
        <label htmlFor="arrivalWindowLength">Arrival Window Length</label>
        <FormSelect
          id="arrivalWindowLength"
          name="arrivalWindowLength"
          required
          disabled={!arrivalWindowLengthResults.data}
          value={arrivalWindow}
          onChange={e => setArrivalWindow(e.target.value)}
          placeholder="Loading..."
          options={[
            { name: '5 minutes', value: 5 },
            { name: '10 minutes', value: 10 },
            { name: '15 minutes', value: 15 },
            { name: '30 minutes', value: 30 },
            { name: '1 Hour', value: 60 }
          ]}
        />
        <FormNote>This value indicates the length of the window of time to give appointments within a time slot</FormNote>
      </FormGroup>


      <FormGroup>
        <RightAlign direction="column">
          <FormButton
            type="submit"
            variety="SUCCESS"
            disabled={updateArrivalWindowResults.loading || updateDefaultAllowedResults.loading}
          >
            {updateArrivalWindowResults.loading || updateDefaultAllowedResults.loading ? 'Saving...' : 'Save'}
          </FormButton>
          {(updateArrivalWindowResults.data || updateDefaultAllowedResults.data) && <SuccessMessage>Changes saved successfully!</SuccessMessage>}
          {(updateArrivalWindowResults.error || updateDefaultAllowedResults.error) && <ErrorMessage error={updateArrivalWindowResults.error || updateDefaultAllowedResults.error} />}
        </RightAlign>
      </FormGroup>
    </form>
  );
};

export default AdminOnlyConfiguration;