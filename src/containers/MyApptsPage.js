import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { isAfter, isBefore } from 'date-fns';

import Appt from './Appt';
import { getDateFromTimeSlot } from '../utils';
import './MyApptsPage.scss';
import ApptCard from '../components/ApptCard';
import Modal from '../components/Modal';

const MY_APPTS = gql`
  {
    myAppts {
      id
      timeSlot {
        date
        hour
      }
      arrivalWindow
      actions {
        id
        type
        containerId
      }
    }
  }
`;

const MyApptsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppt, selectAppt] = useState({ apptId: null, isReadOnly: true });
  const { data, error, loading } = useQuery(MY_APPTS, { fetchPolicy: 'network-only' });

  if (loading) return <div className="my-appts-page">Loading my appointments...</div>;
  if (error) return <div className="my-appts-page">An error occurred when fetching appointments. Please try reloading this page.</div>;

  const upcomingAppts = data.myAppts.filter(appt => isAfter(getDateFromTimeSlot(appt.timeSlot), new Date()));
  const pastAppts = data.myAppts.filter(appt => isBefore(getDateFromTimeSlot(appt.timeSlot), new Date()));

  return (
    <div className="my-appts-page">
      <h1 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Upcoming Appointments</h1>
      {upcomingAppts.length > 0 && (
        <div className="appts-list">
          {upcomingAppts.map(appt => (
            <ApptCard
              appt={appt}
              key={appt.id}
              onClick={() => {
                selectAppt({ apptId: appt.id, isReadOnly: false });
                setIsModalOpen(true);
              }}
              isCustomer
            />
          ))}
        </div>
      )}
      {!upcomingAppts.length && <div style={{ fontSize: '1.2rem' }}>No upcoming appointments</div>}

      <h1 style={{ marginBottom: '0.5rem' }}>Past Appointments</h1>
      {pastAppts.length > 0 && (
        <div className="appts-list">
          {pastAppts.map(appt => (
            <ApptCard
              appt={appt}
              key={appt.id}
              onClick={() => {
                selectAppt({ apptId: appt.id, isReadOnly: true });
                setIsModalOpen(true);
              }}
              isCustomer
            />
          ))}
        </div>
      )}
      {!pastAppts.length && <div style={{ fontSize: '1.2rem' }}>No appointments within the last month</div>}

      <Modal 
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onClosed={() => selectAppt({ apptId: null, isReadOnly: true })}
        title="Edit Appt"
      >
        <Appt apptId={selectedAppt.apptId} isReadOnly={selectedAppt.isReadOnly} isCustomer refetchQueries={[{ query: MY_APPTS }]} onDelete={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default MyApptsPage;