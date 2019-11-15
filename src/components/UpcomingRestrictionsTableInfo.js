import React from 'react';

import './UpcomingRestrictionsTableInfo.scss';

const UpcomingRestrictionsTableInfo = () => (
  <>
    <h1 style={{ marginTop: 0 }}>About This Chart</h1>
    <p>The <strong>Upcoming Gate Capacity Restrictions by Time Slot</strong> chart shows the total number of allowed appointments for each time slot in the next week.</p>

    <h2>Appointment restriction values</h2>
    <p>The number of allowed appointments for a given time slot comes from one of three sources:</p>

    <ol>
      <li style={{ marginBottom: '0.75rem' }}><div className="data-source-name">Time Slot Specific Restriction</div>There is a value set specifically for the time slot (exact date and hour). These values override all other restrictions and highlighted by <span style={{ color: 'blue' }}>blue text</span>.</li>
      <li style={{ marginBottom: '0.75rem' }}><div className="data-source-name">Template Restriction</div>There is a <strong>restriction template</strong> applied which provides a value for the weekday (e.g. Monday) and hour of the time slot. These are shown as standard, black values.</li>
      <li style={{ marginBottom: '0.75rem' }}><div className="data-source-name">System Default</div>There is no value set specifically for the time slot (1.) nor value given in an applied restriction template or no template is applied (2.), so the system <em>Default Allowed Appointments per Hour</em> value is used. These values are indicated by <span style={{ color: 'graytext' }}>gray text</span>.</li>
    </ol>

    <h2>Using the Chart</h2>
    <p>Click on a cell to add, modify, or remove a <strong>time slot specific restriction</strong> and press <code>enter</code> to save it.</p>
    <p>To remove a value, enter nothing. The value in that cell will then fall-back to either a <strong>template restriction</strong> (is existent) or the <strong>system default</strong>.</p>
    <p>The table can also be navigated using the <code>tab</code> key. You will see the cell border highlighted when it is focused</p>
    <p>Press <code>enter</code> on a cell to modify the value and then <code>enter</code> to save it. Press <code>tab</code> again to continue to the next cell and <code>shift + tab</code> to return to the previous cell.</p>
    <p><strong>Note:</strong> it is not possible to edit a <strong>template restriction</strong> or <strong>system default</strong> value through this table. It is only possible to create <strong>time slot specific restrictions</strong> which have the highest precedence.</p>
  </>
);

export default UpcomingRestrictionsTableInfo;
