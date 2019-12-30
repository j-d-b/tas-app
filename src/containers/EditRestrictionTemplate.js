import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { isTemplateTimeSlotEqual } from '../helpers';
import RestrictionsTable from '../components/RestrictionsTable';
import { FormButton } from '../components/Form';
import { ErrorMessage, SuccessMessage } from '../components/ResponseMessage';
import RightAlign from '../components/RightAlign';

const RESTRICTION_TEMPLATE = gql`
  query RestrictionTemplate ($name: String!) {
    restrictionTemplates (input: { name: $name }) {
      restrictions {
        dayOfWeek
        hour
        gateCapacity
      }
    }
  }
`;

const UPDATE_RESTRICTION_TEMPLATE = gql`
  mutation UpdateRestrictionTemplate ($name: String!, $restrictions: [AddTemplateRestrictionInput]) {
    updateRestrictionTemplate (input: { name: $name, restrictions: $restrictions }) {
      restrictions {
        dayOfWeek
        hour
        gateCapacity
      }
    }
  }
`;

const EditRestrictionTemplate = ({ templateName, onSave, refetchQueries }) => {
  const [restrictions, setRestrictions] = useState([]);

  const { data: restrictionTemplateData, error: restrictionTemplateError, loading: restrictionTemplateLoading } = useQuery(
    RESTRICTION_TEMPLATE,
    { 
      variables: { name: templateName },
      fetchPolicy: 'network-only'
    }
  );

  useEffect(() => {
    if (restrictionTemplateData && restrictionTemplateData.restrictionTemplates.length) {
      setRestrictions([...restrictionTemplateData.restrictionTemplates[0].restrictions]);
    }
  }, [restrictionTemplateData]); 

  const [updateTemplate, updateTemplateResults] = useMutation(
    UPDATE_RESTRICTION_TEMPLATE,
    { 
      refetchQueries,
      onCompleted: ({ updateRestrictionTemplate }) => {
        setRestrictions([...updateRestrictionTemplate.restrictions]);
        onSave && onSave();
      }
    }
  );

  const addRestriction = (timeSlot, gateCapacity) => {
    const newRestriction = { ...timeSlot, gateCapacity };
    const restrictionIndex = restrictions.findIndex(res => isTemplateTimeSlotEqual(res, timeSlot));
    if (restrictionIndex !== -1) {
      setRestrictions(restrictions.map((res, i) => restrictionIndex === i ? newRestriction : res));
    } else {
      setRestrictions([...restrictions, newRestriction]);
    }
  };

  const deleteRestriction = (timeSlot, gateCapacity) => {
    const restrictionIndex = restrictions.findIndex(res => isTemplateTimeSlotEqual(res, timeSlot));
    if (restrictionIndex !== -1) {
      setRestrictions(restrictions.filter((res, i) => restrictionIndex !== i));
    }
  };

  if (restrictionTemplateLoading) return <div>Loading...</div>;
  if (restrictionTemplateError) return <div>Error loading restriction template</div>;

  const getValue = timeSlot => {
    const matchingRestriction = restrictions.find(res => isTemplateTimeSlotEqual(timeSlot, res));
    if (matchingRestriction) return matchingRestriction.gateCapacity;
    return '';
  };

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Edit {templateName}</h1>

      <div style={{ overflowX: 'auto', width: '100%' }}>
        <RestrictionsTable
          isEdit
          addRestriction={addRestriction}
          deleteRestriction={deleteRestriction}
          getValue={getValue}
        />
      </div>

      <RightAlign>
        <FormButton
          variety="SUCCESS"
          type="button"
          disabled={updateTemplateResults.loading}
          onClick={() => !updateTemplateResults.loading && updateTemplate({ variables: { name: templateName, restrictions: restrictions.map(({ dayOfWeek, hour, gateCapacity }) => ({ dayOfWeek, hour, gateCapacity })) } })}
        >{updateTemplateResults.loading ? 'Saving...' : 'Save Changes'}</FormButton>
      </RightAlign>

      <RightAlign>
        {updateTemplateResults.data && <SuccessMessage>Saved successfully!</SuccessMessage>}
        {updateTemplateResults.error && <ErrorMessage error={updateTemplateResults.error} />}
      </RightAlign>
    </div>
  );
};

export default EditRestrictionTemplate;