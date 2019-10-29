import React from 'react';

import FormInput from './FormInput';
import FormGroup from './FormGroup';

const EditApptDetails = ({ appt, onEdit }) => (
  <div>
    <FormGroup>
      <label className="appt__label">Comment</label>
      <FormInput
        type="text"
        value={appt.comment || ''}
        onChange={e => onEdit({ ...appt, comment: e.target.value })}
        placeholder="Add a comment"
      />
    </FormGroup>

    <FormGroup>
      <label className="appt__label">Notify Mobile Number</label>
      <FormInput
        type="tel"
        value={appt.notifyMobileNumber || ''}
        onChange={e => onEdit({ ...appt, notifyMobileNumber: e.target.value })}
      />
    </FormGroup>

    <FormGroup>
      <label className="appt__label">License Plate Number</label>
      <FormInput
        type="text"
        value={appt.licensePlateNumber || ''}
        onChange={e => onEdit({ ...appt, licensePlateNumber: e.target.value })}
      />
    </FormGroup>
  </div>
);

export default EditApptDetails;
