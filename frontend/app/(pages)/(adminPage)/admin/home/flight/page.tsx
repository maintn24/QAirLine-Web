'use client';
import React, { useState, useEffect } from 'react';
import { Flight } from './flightObject';
import FlightTable from './(components)/FlightTable';
import FlightForm from './(components)/FlightForm';
import styles from './flightPage.module.css';

// export type Flight = {
//   ID: number;
//   Aircraft: string;
//   FlightHour: string; // Giữ kiểu đồng nhất
//   Departure: string;
//   Arrival: string;
//   SeatAvailable: number;
//   Price: number;
//   Status: string;
// };


export default function FlightManagement() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchFlights = async () => {
    const response = await fetch('/api/flights');
    const data = await response.json();
    setFlights(data);
  };

  const handleAdd = () => {
    setCurrentFlight(null);
    setShowForm(true);
  };

  // Xử lý submit form (Thêm hoặc sửa chuyến bay)
  const handleSubmit = async (flight: Flight) => {
    try {
      if (currentFlight) {
        // Cập nhật chuyến bay (edit)
        await fetch(`/api/flights/${currentFlight.ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(flight),
        });
        // Cập nhật state sau khi sửa
        setFlights(flights.map((f) => (f.ID === currentFlight.ID ? flight : f)));
      } else {
        // Thêm chuyến bay mới (add)
        const response = await fetch('/api/flights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(flight),
        });
        const newFlight = await response.json();
        setFlights([...flights, newFlight]);
      }
      setShowForm(false);
      fetchFlights(); // Reload dữ liệu chuyến bay
    } catch (error) {
      console.error('Error submitting flight:', error);
    }
  };

  // Xóa chuyến bay
  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/flights/${id}`, { method: 'DELETE' });
      setFlights(flights.filter((f) => f.ID !== id));
    } catch (error) {
      console.error('Error deleting flight:', error);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Flight Management</h1>
      <button className={styles.addButton} onClick={handleAdd}>Add Flight</button>
      <FlightTable flights={flights} onEdit={setCurrentFlight} onDelete={handleDelete} />
      {showForm && <FlightForm flight={currentFlight} onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}
    </div>
  );
}
