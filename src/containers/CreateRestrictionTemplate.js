import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import RestrictionsTable from '../components/RestrictionsTable';
import { FormButton, FormGroup, FormInput } from '../components/Form';
import { ErrorMessage, SuccessMessage } from '../components/ResponseMessage';
import RightAlign from '../components/RightAlign';

const ADD_RESTRICTION_TEMPLATE = gql`
  mutation AddRestrictionTemplate ($name: String!, $restrictions: [AddTemplateRestrictionInput]) {
    addRestrictionTemplate (input: { name: $name, restrictions: $restrictions }) {
      name
    }
  }
`;

const isTemplateTimeSlotEqual = (templateTimeSlot1, templateTimeSlot2) => (
  templateTimeSlot1.dayOfWeek === templateTimeSlot2.dayOfWeek && templateTimeSlot1.hour === templateTimeSlot2.hour
);

const TemplateCellValue = ({ restrictions, timeSlot, editableValue, isSelected }) => {
  const matchingRestriction = restrictions.find(res => isTemplateTimeSlotEqual(timeSlot, res));
  if (matchingRestriction) {
    return <div>{matchingRestriction.gateCapacity}</div>
  }

  return <div></div>;
};

const CreateRestrictionTemplate = ({ onSave, refetchQueries }) => {
  const [templateName, setTemplateName] = useState('');
  const [restrictions, setRestrictions] = useState([]);

  const [createTemplate, { data, error, loading }] = useMutation(
    ADD_RESTRICTION_TEMPLATE,
    { 
      refetchQueries,
      onCompleted: () => onSave && onSave()
    }
  );

  const addRestriction = (timeSlot, gateCapacity) => {
    const newRestriction = { ...timeSlot, gateCapacity };
    const restrictionIndex = restrictions.findIndex(res => isTemplateTimeSlotEqual(res, timeSlot));
    if (restrictionIndex !== -1) {
      setRestrictions(restrictions.map((res, i) => restrictionIndex === i ? newRestriction : res));
    } else {
      setRestrictions([ ...restrictions, newRestriction ]);
    }
  };

  const deleteRestriction = (timeSlot, gateCapacity) => {
    const restrictionIndex = restrictions.findIndex(res => isTemplateTimeSlotEqual(res, timeSlot));
    if (restrictionIndex !== -1) {
      setRestrictions(restrictions.filter((res, i) => restrictionIndex !== i));
    }
  };

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>New Restriction Template</h1>

      <form
        name="newRestrictionTemplate"
        onSubmit={() => {
          createTemplate({ variables: { name: templateName, restrictions: restrictions.map(({ dayOfWeek, hour, gateCapacity }) => ({ dayOfWeek, hour, gateCapacity })) }});
        }}
      >
        <FormGroup>
          <label htmlFor="template-name" style={{ display: 'block' }}>Template Name</label>
          <FormInput
            style={{ maxWidth: '400px' }}
            id="template-name"
            minLength="1"
            name="template-name"
            type="text"
            value={templateName}
            required
            onChange={e => setTemplateName(e.target.value)}
          />
        </FormGroup>

        <RestrictionsTable
          isEdit
          addRestriction={addRestriction}
          deleteRestriction={deleteRestriction}
          cellValueComponent={props => (
            <TemplateCellValue
              restrictions={restrictions}
              {...props}
            />
          )}
        />

        <RightAlign>
          <FormButton
            variety="SUCCESS"
            type="submit"
            disabled={loading || !templateName}
          >{loading ? 'Requesting...' : 'Create Template'}</FormButton>
        </RightAlign>
      </form>

      <RightAlign>
        {data && <SuccessMessage>Saved successfully!</SuccessMessage>}
        {error && <ErrorMessage error={error} />}
      </RightAlign>
    </div>
  );
}

export default CreateRestrictionTemplate;