'use client';
import React, { useState, useEffect } from 'react';
import { Flight } from './flightObject';
import FlightTable from './(components)/FlightTable';
import FlightForm from './(components)/FlightForm';
import styles from './flightPage.module.css';

export default function FlightManagement() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Lấy userID từ decodeToken trong localStorage
  const getUserID = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.userid;
  };

  const fetchFlights = async () => {
    try {
      const userid = getUserID();
      if (!userid) throw new Error('User not authenticated');
      const response = await fetch('http://localhost:3001/api/Flights/GetAllFlights', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handleAdd = () => {
    setCurrentFlight(null);
    setShowForm(true);
  };

  const handleSubmit = async (flight: Partial<Flight>) => {
    try {
      const userid = getUserID();
      if (!userid) throw new Error('User not authenticated');
  
      if (currentFlight && flight.FlightID) {
        // Edit flight
        const response = await fetch('http://localhost:3001/api/Flights/Edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userid, ...flight }),
        });
        const result = await response.json();
        if (result.message === 'Flight updated successfully') {
          alert('Flight updated successfully');
          fetchFlights();
        }
      } else {
        // Add new flight
        const { FlightID, ...newFlightData } = flight; // Loại bỏ FlightID

        // Map lại các key trong newFlightData
        const mappedData = {
          model: newFlightData.AircraftModel,
          departure: newFlightData.Departure,
          arrival: newFlightData.Arrival,
          departureTime: newFlightData.DepartureTime,
          arrivalTime: newFlightData.ArrivalTime,
          price: newFlightData.Price,
          seatsAvailable: newFlightData.SeatsAvailable,
          status: newFlightData.Status,
          userID: userid,
        };

        const response = await fetch('http://localhost:3001/api/Flights/Add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mappedData),
        });

        console.log(mappedData);

        const result = await response.json();
        if (result.message === 'Flight added successfully') {
          alert('Flight added successfully');
          fetchFlights();
        }
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting flight:', error);
    }
  };
  

  const handleDelete = async (flightID: number) => {
    try {
      const UserID = getUserID();
      console.log('UserID:', UserID); // Debug UserID
      if (!UserID) throw new Error('User not authenticated');

      const response = await fetch('http://localhost:3001/api/Flights/Delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightID, UserID }), // Debug body content
      });

      console.log('FlightID:', flightID, 'UserID:', UserID); // Debug request payload

      const result = await response.json();
      console.log('Delete Response:', result);
  
      // Xử lý các trường hợp trả về
      if (response.status === 200) {
        // Trường hợp xóa thành công
        alert(result.message);
        setFlights((prevFlights) => prevFlights.filter((f) => f.FlightID !== flightID));
      } else if (response.status === 400) {
        // Trường hợp thiếu dữ liệu đầu vào
        alert(`Error: ${result.message}`);
      } else if (response.status === 403) {
        // Trường hợp quyền truy cập bị từ chối
        alert(`Permission denied: ${result.message}`);
      } else if (response.status === 404) {
        // Trường hợp không tìm thấy chuyến bay
        alert(`Not found: ${result.message}`);
      } else if (response.status === 500) {
        // Trường hợp lỗi máy chủ
        alert(`Server error: ${result.message}`);
      } else {
        // Trường hợp không xác định
        alert('Unexpected error occurred. Please try again.');
      }
  
      console.log('Delete Response:', result); // Log phản hồi để debug
    } catch (error) {
      // Xử lý lỗi trong quá trình gửi yêu cầu
      console.error('Error deleting flight:', error);
      alert('An error occurred while deleting the flight. Please try again.');
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
