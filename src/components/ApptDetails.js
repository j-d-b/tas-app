import React from 'react';
import { format } from 'date-fns';

import { getApptDate, getFriendlyActionType } from '../utils';
import Action from './Action';

const ApptDetails = ({ appt, isCustomer }) => (
  <div>
    <h1 style={{ marginTop: 0 }}>Appointment: {appt.id}</h1>

    <h2 style={{ marginBottom: '0.5rem' }}>Details</h2>

    <table style={{ width: '100%' }}>
      <tbody>
        <tr>
          <th>ID</th>
          <td>{appt.id}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>{format(getApptDate(appt), `iii, MMM d, yyyy`)}</td>
        </tr>
        <tr>
          <th>{isCustomer ? 'Time' : 'Arrival Window'}</th>
          <td>{appt.arrivalWindow}</td>
        </tr>
        <tr>
          <th>Comment</th>
          <td>{appt.comment}</td>
        </tr>
        <tr>
          <th>Driver Mobile Number</th>
          <td>{appt.notifyMobileNumber}</td>
        </tr>
        <tr>
          <th>Company</th>
          <td>{appt.licensePlateNumber}</td>
        </tr>
      </tbody>
    </table>

    {!isCustomer && (
      <div>
        <h2 style={{ marginBottom: '0.5rem' }}>Customer</h2>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <th>Email</th>
              <td>{appt.user.email}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{appt.user.name}</td>
            </tr>
            <tr>
              <th>Company</th>
              <td>{appt.user.company}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )}

    {appt.actions.map((action, index) => (
      <div key={action.id}>
        <h2 style={{ marginBottom: '0.5rem' }}>Action {index + 1}: {getFriendlyActionType(action.type, isCustomer ? 'CUSTOMER' : 'OPERATOR')}</h2>
        <Action action={action} />
      </div>
    ))}
  </div>
);

export default ApptDetails;