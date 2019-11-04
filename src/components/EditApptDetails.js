import React from 'react';

import { FormGroup, FormInput, FormNote } from './Form';

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
        placeholder="Add a free-text comment"
      />
    </FormGroup>

    <FormGroup>
      <label className="appt__label" htmlFor="notifyMobileNumber">Driver Mobile Number (for notifications)</label>
      <FormInput
        id="notifyMobileNumber"
        name="notifyMobileNumber"
        type="tel"
        value={appt.notifyMobileNumber || ''}
        onChange={e => onEdit({ ...appt, notifyMobileNumber: e.target.value })}
      />
      <FormNote>If included, this number will be notified when the appointment is booked as well the day before it occurs</FormNote>
    </FormGroup>

    <FormGroup>
      <label className="appt__label" htmlFor="licensePlateNumber">Truck License Plate Number</label>
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
