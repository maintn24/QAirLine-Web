import React from 'react';
import styles from './styles/flightTable.module.css';
import { Flight } from '../flightObject';

type FlightTableProps = {
  flights: Flight[];
  onEdit: (flight: Flight) => void;
  onDelete: (id: number) => void;
};

export default function FlightTable({ flights, onEdit, onDelete }: FlightTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Aircraft Model</th>
          <th>Departure</th>
          <th>Arrival</th>
          <th>Departure Time</th>
          <th>Arrival Time</th>
          <th>Price</th>
          <th>Seats Available</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {flights.map((flight) => (
          <tr key={flight.FlightID}>
            <td>{flight.FlightID}</td>
            <td>{flight.AircraftModel}</td>
            <td>{flight.Departure}</td>
            <td>{flight.Arrival}</td>
            <td>{flight.DepartureTime}</td>
            <td>{flight.ArrivalTime}</td>
            <td>{flight.Price}</td>
            <td>{flight.SeatsAvailable}</td>
            <td>{flight.Status}</td>
            <td>
              <button className={`${styles.button} ${styles.editButton}` } onClick={() => onEdit(flight)}>Edit</button>
              <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => onDelete(flight.FlightID)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
