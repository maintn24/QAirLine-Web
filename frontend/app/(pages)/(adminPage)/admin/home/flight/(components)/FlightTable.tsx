import React from 'react';
import styles from './styles/flightTable.module.css';
import { Flight } from "../flightObject";

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
          <th>ID</th><th>Aircraft</th><th>Flight Hour</th><th>Departure</th>
          <th>Arrival</th><th>Seats</th><th>Price</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {flights.map((flight) => (
          <tr key={flight.ID}>
            <td>{flight.ID}</td>
            <td>{flight.Aircraft}</td>
            <td>{flight.FlightHour}</td>
            <td>{flight.Departure}</td>
            <td>{flight.Arrival}</td>
            <td>{flight.SeatAvailable}</td>
            <td>{flight.Price}</td>
            <td>{flight.Status}</td>
            <td>
              <button className={styles.button} onClick={() => onEdit(flight)}>Edit</button>
              <button className={styles.button} onClick={() => onDelete(flight.ID)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
