import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import CreateRestrictionTemplate from './CreateRestrictionTemplate';
import EditRestrictionTemplate from './EditRestrictionTemplate';
import Modal from '../components/Modal';
import { FormButton } from '../components/Form';
import RightAlign from '../components/RightAlign';
import { ErrorMessage, SuccessMessage } from '../components/ResponseMessage';
import TemplateList from '../components/TemplateList';

const ALL_TEMPLATES = gql`
  {
    restrictionTemplates (input: {}) {
      name
      isApplied
    }
  }
`;

const APPLIED_TEMPLATE = gql`
  {
    appliedRestrictionTemplate (input: {}) {
      name
      restrictions {
        dayOfWeek
        gateCapacity
        hour
      }
    }
  }
`;

const SET_APPLIED_TEMPLATE = gql`
  mutation SetAllowedTemplate ($name: String) {
    setAppliedRestrictionTemplate (input: { templateName: $name }) {
      isApplied
    }
  }
`;

const DELETE_RESTRICTION_TEMPLATE = gql`
  mutation DeleteRestrictionTemplate ($name: String!) {
    deleteRestrictionTemplate (input: { name: $name })
  }
`;

const ManageTemplates = () => {
  const [selectedTemplateName, selectTemplateName] = useState(null);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isTemplateCreatorOpen, setIsTemplateCreatorOpen] = useState(false);

  const allTemplatesResults = useQuery(ALL_TEMPLATES);

  const [setAppliedTemplate, setAppliedTemplateResults] = useMutation(
    SET_APPLIED_TEMPLATE,
    { refetchQueries: [{ query: ALL_TEMPLATES }, { query: APPLIED_TEMPLATE }] }
  );

  const [deleteTemplate, deleteTemplateResults] = useMutation(
    DELETE_RESTRICTION_TEMPLATE,
    {
      refetchQueries: [{ query: ALL_TEMPLATES }, { query: APPLIED_TEMPLATE }],
      onCompleted: () => setIsDeleteConfirmOpen(false)
    }
  );

  if (allTemplatesResults.loading) return <div>Loading...</div>

  return (
    <div>
      <div>
        <h1 style={{ fontSize: '1.6rem', marginTop: 0 }}>Manage Templates</h1>
        
        <TemplateList
          isLoading={setAppliedTemplateResults.loading || deleteTemplateResults.loading}
          allTemplates={allTemplatesResults.data.restrictionTemplates}
          applyTemplate={templateName => setAppliedTemplate({ variables: { name: templateName } })}
          unapplyTemplate={() => setAppliedTemplate()}
          triggerDelete={templateName => {
            selectTemplateName(templateName);
            setIsDeleteConfirmOpen(true);
          }}
          triggerEdit={templateName => {
            selectTemplateName(templateName);
            setIsTemplateEditorOpen(true);
          }}
        />

        <RightAlign>
          <FormButton
            style={{ marginTop: '0.75rem' }}
            type="button"
            onClick={() => setIsTemplateCreatorOpen(true)}
          >Create New Template</FormButton>
        </RightAlign>
      </div>

      <Modal 
        isOpen={isTemplateEditorOpen}
        closeModal={() => setIsTemplateEditorOpen(false)}
        onClosed={() => selectTemplateName(null)}
        title="Edit Restriction Template"
        maxWidth="min-content"
      >
        <div>
          <EditRestrictionTemplate
            templateName={selectedTemplateName}
            refetchQueries={[{ query: ALL_TEMPLATES }, { query: APPLIED_TEMPLATE }]}
            onSave={() => setIsTemplateEditorOpen(false)}
          />
        </div>
      </Modal>

      <Modal 
        isOpen={isTemplateCreatorOpen}
        closeModal={() => setIsTemplateCreatorOpen(false)}
        onClosed={() => selectTemplateName(null)}
        title="Create New Restriction Template"
        maxWidth="min-content"
      >
        <div>
          <CreateRestrictionTemplate
            refetchQueries={[{ query: ALL_TEMPLATES }]}
            onSave={() => setIsTemplateCreatorOpen(false)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        closeModal={() => setIsDeleteConfirmOpen(false)}
        onClosed={() => selectTemplateName(null)}
        title="Confirm Delete Restriction Template"
      >
        <div>
          <h1 style={{ marginTop: 0 }}>Confirm Template Deletion</h1>
          <p>Are you sure you want to delete <strong style={{ fontFamily: `Roboto Condensed', sans-serif`, textTransform: 'uppercase' }}>{selectedTemplateName}</strong>?</p>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormButton type="button" style={{ marginRight: '0.3rem' }} onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</FormButton>
            <FormButton
              type="button"
              variety="DANGER"
              disabled={deleteTemplateResults.loading}
              onClick={() => !deleteTemplateResults.loading && deleteTemplate({ variables: { name: selectedTemplateName } })}
            >{deleteTemplateResults.loading ? 'Requesting...' : 'Delete'}</FormButton>
          </div>

          <RightAlign>
            {deleteTemplateResults.error && <ErrorMessage error={deleteTemplateResults.error} />}
          </RightAlign>
        </div>
      </Modal>
    </div>
  );
}

export default ManageTemplates;