import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import './SchedulerPage.scss';
import Scheduler from './Scheduler';
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

const SchedulerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppt, selectAppt] = useState(null);
  const { data, error, loading } = useQuery(MY_APPTS);

  return (
    <div className="scheduler-page">
      <div className="scheduler-box">
        <Scheduler refetchQueries={[{ query: MY_APPTS }]} />
      </div>

      <div className="my-appts">
        <h1 style={{ marginTop: '0.5rem' }}>My Appointments</h1>
        <div className="my-appts__list">
          {error && 'An error occurred when fetching appointments. Please try reloading this page.'}
          {loading && 'Loading appointments...'}
          {data && data.myAppts.map(appt => (
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
      </div>

      <Modal 
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onClosed={() => selectAppt(null)}
        title="Edit Appt"
      >
        <EditAppt appt={selectedAppt} isCustomer refetchQueries={[{ query: MY_APPTS }]} onDelete={() => selectAppt(null)} />
      </Modal>
    </div>
  );

};

export default SchedulerPage;