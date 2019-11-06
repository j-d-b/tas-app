import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { FormSelect, FormInput, FormGroup, FormButton, FormNote } from '../components/Form';

const UPDATE_USER = gql`
  mutation UpdateUser ($user: UpdateUserInput!) {
    updateUser(input: $user) {
      name
    }
  }
`;

const UserDetailsInput = ({ field, label, value, onEdit, isRequired, type }) => (
  <>
    <label htmlFor={field}>{label}{isRequired ? '*' : ''}</label>
    <FormInput
      name={field}
      id={field}
      value={value || ''}
      onChange={onEdit}
      required={isRequired}
      type={type}
    />
  </>
);

const EditUser = ({ user, onCancel, refetchQueries }) => {
  const [edits, setEdits] = useState(user);
  const onEdit = e => setEdits({ ...edits, [e.target.name]: e.target.value });

  const [updateUser, { error, loading, data }] = useMutation(
    UPDATE_USER,
    { 
      onCompleted: onCancel,
      refetchQueries
    }
  );

  const onSave = () => {
    updateUser({ 
      variables: { 
        user: {
          name: edits.name,
          email: edits.email,
          company: edits.company,
          companyType: edits.companyType,
          companyRegNumber: edits.companyRegNumber,
          mobileNumber: edits.mobileNumber,
          reminderSetting: edits.reminderSetting,
          ...(edits.role && { role: edits.role })
        } 
      }
    });
  };

  return (
    <form 
      name="userForm"
      onSubmit={e => {
        e.preventDefault();
        onSave();
      }}
    >
      <FormGroup>
        <UserDetailsInput
          field="name"
          label="Name"
          type="text"
          value={edits.name}
          onEdit={onEdit}
          isRequired={true}
        />
      </FormGroup>

      {edits.role && (
        <FormGroup>
          <label htmlFor="role">Role*</label>
          <FormSelect
            name="role"
            id="role"
            value={edits.role}
            onChange={onEdit}
            options={[
              { name: 'Customer', value: 'CUSTOMER'},
              { name: 'Operator', value: 'OPERATOR' },
              { name: 'Admin', value: 'ADMIN' }
            ]}
          />
        </FormGroup>
      )}

      <FormGroup>
        <UserDetailsInput
          field="company"
          label="Company"
          type="text"
          value={edits.company}
          onEdit={onEdit}
          isRequired={true}
        />
      </FormGroup>

      <FormGroup>
        <UserDetailsInput
          field="companyType"
          label="Company Type"
          type="text"
          value={edits.companyType}
          onEdit={onEdit}
        />
      </FormGroup>

      <FormGroup>
        <UserDetailsInput
          field="companyRegNumber"
          label="Company Reg. Number"
          type="number"
          value={edits.companyRegNumber}
          onEdit={onEdit}
        />
      </FormGroup>

      <FormGroup>
        <UserDetailsInput
          field="mobileNumber"
          label="Mobile Number"
          type="number"
          value={edits.mobileNumber}
          onEdit={onEdit}
        />
      </FormGroup>

      <label htmlFor="reminderSetting">Reminder Setting*</label>
      <FormSelect
        name="reminderSetting"
        id="reminderSetting"
        value={edits.reminderSetting}
        onChange={e => setEdits({ ...edits, reminderSetting: e.target.value })}
        options={[
          { name: 'Email', value: 'EMAIL' },
          { name: 'SMS', value: 'SMS' },
          { name: 'Email & SMS', value: 'BOTH'},
          { name: 'Notifications Off', value: 'NONE' }
        ]}
      />

      <FormNote>* indicates a required field</FormNote>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {onCancel && <FormButton type="button" style={{ marginRight: '0.3rem' }} onClick={onCancel}>Cancel</FormButton>}
        <FormButton type="submit" variety="SUCCESS" disabled={loading}>{loading ? 'Saving...' : 'Save'}</FormButton>
      </div>

      {error && <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error.toString()}</div>}
      {data && <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'green', marginTop: '0.5rem', fontSize: '0.9rem' }}>Changes saved successfully!</div>}
    </form>
  );
};

export default EditUser;