import React from 'react';

import { FormGroup, FormInput } from './Form';

const EditApptDetails = ({ appt, onEdit }) => (
  <div>
    <FormGroup>
      <label className="appt__label" htmlFor="comment">Comment</label>
      <FormInput
        id="comment"
        type="text"
        name="comment"
        value={appt.comment || ''}
        onChange={e => onEdit({ ...appt, comment: e.target.value })}
        placeholder="Add a comment"
      />
    </FormGroup>

    <FormGroup>
      <label className="appt__label" htmlFor="notifyMobileNumber">Mobile Number (for notifications)</label>
      <FormInput
        id="notifyMobileNumber"
        name="notifyMobileNumber"
        type="tel"
        value={appt.notifyMobileNumber || ''}
        onChange={e => onEdit({ ...appt, notifyMobileNumber: e.target.value })}
      />
    </FormGroup>

    <FormGroup>
      <label className="appt__label" htmlFor="licensePlateNumber">License Plate Number</label>
      <FormInput
        id="licensePlateNumber"
        name="licensePlateNumber"
        type="text"
        value={appt.licensePlateNumber || ''}
        onChange={e => onEdit({ ...appt, licensePlateNumber: e.target.value })}
      />
    </FormGroup>
  </div>
);

export default EditApptDetails;
