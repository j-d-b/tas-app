import React from 'react';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

import { getPrettyUserRole } from '../helpers';

const getFriendlyReminderSetting = reminderSetting => {
  switch (reminderSetting) {
    case 'EMAIL': return 'Email';
    case 'SMS': return 'SMS';
    case 'BOTH': return 'Email & SMS';
    case 'NONE': return 'Notifications Off';
    default: return 'Notifications Off';
  }
};

const UserDetails = ({ user }) => (
  <table style={{ width: '100%' }}>
    <tbody>
      <tr>
        <th>Name</th>
        <td>{user.name}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>{user.email}</td>
      </tr>
      <tr>
        <th>Mobile Number</th>
        <td>{formatPhoneNumberIntl(user.mobileNumber)}</td>
      </tr>
      <tr>
        <th>Role</th>
        <td>{getPrettyUserRole(user.role)}</td>
      </tr>
      <tr>
        <th>Company</th>
        <td>{user.company}</td>
      </tr>
      <tr>
        <th>Company Type</th>
        <td>{user.companyType}</td>
      </tr>
      <tr>
        <th>Company Reg. Number</th>
        <td>{user.companyRegNumber}</td>
      </tr>
      <tr>
        <th>Company Type</th>
        <td>{user.companyType}</td>
      </tr>
      <tr>
        <th>Confirmed</th>
        <td>{user.confirmed ? 'Yes' : 'No'}</td>
      </tr>    
      <tr>
        <th>Email Verified</th>
        <td>{user.emailVerified ? 'Yes' : 'No'}</td>
      </tr>
      <tr>
        <th>Reminder Setting</th>
        <td>{getFriendlyReminderSetting(user.reminderSetting)}</td>
      </tr>
    </tbody>
  </table>
);

export default UserDetails;