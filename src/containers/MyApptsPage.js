import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { isAfter, isBefore } from 'date-fns';

import { getDateFromTimeSlot } from '../utils';
import './MyApptsPage.scss';
import ApptCard from '../components/ApptCard';
import Modal from '../components/Modal';
import EditAppt from './EditAppt';

const MY_APPTS = gql`
  {
    myAppts {
      id
      user {
        email
        name
        company
      }
      timeSlot {
        date
        hour
      }
      arrivalWindow
      actions {
        id
        type
        containerSize
        containerId
        shippingLine
        containerType
        formNumber705
        emptyForCityFormNumber
        containerWeight
        bookingNumber
      }
      licensePlateNumber
      notifyMobileNumber
      comment
    }
  }
`;


const MyApptsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppt, selectAppt] = useState(null);
  const { data, error, loading } = useQuery(MY_APPTS, { fetchPolicy: 'network-only' });

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>An error occurred when fetching appointments. Please try reloading this page.</div>;

  const upcomingAppts = data.myAppts.filter(appt => isAfter(new Date(getDateFromTimeSlot(appt.timeSlot)), new Date()));
  const pastAppts = data.myAppts.filter(appt => isBefore(new Date(getDateFromTimeSlot(appt.timeSlot)), new Date()));

  return (
    <div className="my-appts-page">
      <h1>Upcoming Appointments</h1>
      <div className="appts-list">
        {upcomingAppts.map(appt => (
          <ApptCard
            appt={appt}
            key={appt.id}
            onClick={() => {
              selectAppt(appt);
              setIsModalOpen(true);
            }}
            isCustomer
          />
        ))}
      </div>
      {!upcomingAppts.length && <div>No Upcoming Appointments</div>}

      <h1>Past Appointments</h1>
      <div className="appts-list">
        {pastAppts.map(appt => (
          <ApptCard
            appt={appt}
            key={appt.id}
            onClick={() => {
              selectAppt(appt);
              setIsModalOpen(true);
            }}
            isCustomer
          />
        ))}
      </div>
      {!pastAppts.length && <div>No Past Appointments</div>}

      <Modal 
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onClosed={() => selectAppt(null)}
        title="Edit Appt"
      >
        <EditAppt appt={selectedAppt} isCustomer refetchQueries={[{ query: MY_APPTS }]} onDelete={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
};

export default MyApptsPage;