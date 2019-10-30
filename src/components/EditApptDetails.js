import React from 'react';

import { FormGroup, FormInput } from './Form';

const EditApptDetails = ({ appt, onEdit }) => (
  <div>
    <FormGroup>
      <label className="appt__label" htmlFor="comment">Comment</label>
      <FormInput
        id="comment"
        type="text"
        value={appt.comment || ''}
        onChange={e => onEdit({ ...appt, comment: e.target.value })}
        placeholder="Add a comment"
      />
    </FormGroup>

    <FormGroup>
      <label className="appt__label" htmlFor="notifyMobileNumber">Notify Mobile Number</label>
      <FormInput
        id="notifyMobileNumber"
        type="tel"
        value={appt.notifyMobileNumber || ''}
        onChange={e => onEdit({ ...appt, notifyMobileNumber: e.target.value })}
      />
    </FormGroup>

    <FormGroup>
      <label className="appt__label" htmlFor="licensePlateNumber">License Plate Number</label>
      <FormInput
        id="licensePlateNumber"
        type="text"
        value={appt.licensePlateNumber || ''}
        onChange={e => onEdit({ ...appt, licensePlateNumber: e.target.value })}
      />
    </FormGroup>
  </div>
);

export default EditApptDetails;
