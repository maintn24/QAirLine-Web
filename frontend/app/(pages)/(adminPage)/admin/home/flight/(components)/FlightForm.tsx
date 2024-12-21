import React, { useState } from 'react';
import styles from './styles/flightForm.module.css';
import { Flight } from '../flightObject';
import { parse, format } from 'date-fns';

type FlightFormProps = {
  flight: Flight | null; // Nếu là null, form sẽ dùng để thêm mới
  onClose: () => void;
  onSubmit: (flight: Partial<Flight>) => void; // Dùng Partial để chấp nhận thiếu FlightID khi thêm mới
};

export default function FlightForm({ flight, onClose, onSubmit }: FlightFormProps) {
  const [formData, setFormData] = useState<Partial<Flight>>({
    FlightID: flight?.FlightID || undefined,
    AircraftModel: flight?.AircraftModel || '',
    Departure: flight?.Departure || '',
    Arrival: flight?.Arrival || '',
    DepartureTime: flight?.DepartureTime || '',
    ArrivalTime: flight?.ArrivalTime || '',
    Price: flight?.Price || 0,
    SeatsAvailable: flight?.SeatsAvailable || 0,
    Status: flight?.Status || 'Scheduled',
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'Price' || name === 'SeatsAvailable' ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Chuyển đổi trước khi gửi
    const formattedData = {
      ...formData,
      DepartureTime: formData.DepartureTime
        ? parse(formData.DepartureTime, 'dd/MM/yyyy HH:mm', new Date()).toISOString()
        : '',
      ArrivalTime: formData.ArrivalTime
        ? parse(formData.ArrivalTime, 'dd/MM/yyyy HH:mm', new Date()).toISOString()
        : '',
    };
    onSubmit(formattedData);
  };
  

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>{flight ? 'Edit Flight' : 'Add Flight'}</h2>
        <form onSubmit={handleSubmit}>
          {flight && (
            <div className={`${styles.formGroup} ${styles.inputField}`}>
              <label htmlFor="FlightID">Flight ID</label>
              <input type="text" id="FlightID" name="FlightID" value={formData.FlightID} disabled />
            </div>
          )}
          <div className={`${styles.formGroup} ${styles.inputField}`}>
            <label htmlFor="AircraftModel">Aircraft Model</label>
            <input
              type="text"
              id="AircraftModel"
              name="AircraftModel"
              value={formData.AircraftModel}
              onChange={handleChange}
              required
            />
          </div>
          <div className={`${styles.formGroup} ${styles.inputField}`}>
            <label htmlFor="Departure">Departure</label>
            <input
              type="text"
              id="Departure"
              name="Departure"
              value={formData.Departure}
              onChange={handleChange}
              required
            />
          </div>
          <div className={`${styles.formGroup} ${styles.inputField}`}>
            <label htmlFor="Arrival">Arrival</label>
            <input
              type="text"
              id="Arrival"
              name="Arrival"
              value={formData.Arrival}
              onChange={handleChange}
              required
            />
          </div>
          <div className={`${styles.formGroup} ${styles.inputField}`}>
            <label htmlFor="DepartureTime">Departure Time</label>
            <input
              type="text"
              id="DepartureTime"
              name="DepartureTime"
              value={formData.DepartureTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className={`${styles.formGroup} ${styles.inputField}`}>
            <label htmlFor="ArrivalTime">Arrival Time</label>
            <input
              type="text"
              id="ArrivalTime"
              name="ArrivalTime"
              value={formData.ArrivalTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className={`${styles.formGroup} ${styles.inputField}`}>
            <label htmlFor="Price">Price</label>
            <input
              type="number"
              id="Price"
              name="Price"
              value={formData.Price}
              onChange={handleChange}
              required
            />
          </div>
          <div className={`${styles.formGroup} ${styles.inputField}`}>
            <label htmlFor="SeatsAvailable">Seats Available</label>
            <input
              type="number"
              id="SeatsAvailable"
              name="SeatsAvailable"
              value={formData.SeatsAvailable}
              onChange={handleChange}
              required
            />
          </div>
          <div className={`${styles.formGroup} ${styles.inputField}`}>
            <label htmlFor="Status">Status</label>
            <input
              type="text"
              id="Status"
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
