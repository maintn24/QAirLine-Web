'use client'
import React, { useState, useEffect } from 'react';
import styles from "./aircraftPage.module.css";
import AircraftTable from './(component)/AircraftTable';
import AircraftForm from './(component)/AircraftForm';
import { Aircraft } from './aircraftObject';

export default function AircraftManagementPage() {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hàm lấy userID từ localStorage
  const getUserID = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.userid;
  };

  // Fetch data từ API
  useEffect(() => {
    async function fetchAircrafts() {
      try {
        const userID = getUserID();
        if (!userID) throw new Error('User not authenticated');
        
        const response = await fetch('http://localhost:3001/api/Aircrafts/GetAll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID }) // Thêm userID vào request body
        });
        
        const data = await response.json();
        if (!response.ok || data.message !== 'Aircraft information retrieved successfully') {
          throw new Error(data.message || 'Failed to fetch aircrafts');
        }
        
        setAircrafts(data.aircrafts);
      } catch (error: any) {
        setErrorMessage(error.message);
        console.error('Error fetching aircrafts:', error);
      }
    }
    fetchAircrafts();
  }, []);

  const handleAddAircraft = () => {
    setSelectedAircraft(null); // Reset khi mở form mới
    setIsFormOpen(true);
  };

  const handleEditAircraft = (aircraft: Aircraft) => {
    setSelectedAircraft(aircraft);
    setIsFormOpen(true);
  };

  const handleDeleteAircraft = async (id: number) => {
    try {
      const userID = getUserID();
      if (!userID) throw new Error('User not authenticated');

      const response = await fetch('http://localhost:3001/api/Aircrafts/Delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID, aircraftID: id }),
      });

      const result = await response.json();
      if (!response.ok || result.message !== 'Aircraft deleted successfully') {
        throw new Error(result.message || 'Failed to delete aircraft');
      }
      
      alert(result.message);
      setAircrafts(aircrafts.filter((a) => a.AircraftID !== id));
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error('Error deleting aircraft:', error);
    }
  };

  const handleFormSubmit = async (formData: Aircraft) => {
    try {
      const userID = getUserID();
      if (!userID) throw new Error('User not authenticated');

      let url = '';
      let method = '';
      let bodyData = {};

      if (selectedAircraft && formData.AircraftID) {
        // Chỉnh sửa thông tin tàu bay
        url = 'http://localhost:3001/api/Aircrafts/Edit';
        method = 'POST';
        bodyData = {
          UserID: userID,
          AircraftID: formData.AircraftID,
          Model: formData.Model,
          Manufacture: formData.Manufacturer,
          Capacity: formData.Capacity,
          RangeKm: formData.RangeKm,
          Description: formData.Description,
        };
      } else {
        // Thêm mới tàu bay
        url = 'http://localhost:3001/api/Aircrafts/Add';
        method = 'POST';
        bodyData = {
          Model: formData.Model,
          Manufacturer: formData.Manufacturer,
          Capacity: formData.Capacity,
          RangeKm: formData.RangeKm,
          Description: formData.Description,
          UserID: userID,
        };
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      console.log(bodyData);
      const result = await response.json();
      if (!response.ok || (result.message !== 'Aircraft added successfully' && result.message !== 'Aircraft information updated successfully')) {
        throw new Error(result.message || 'Failed to save aircraft');
      }

      alert(result.message);
      if (result.aircraftID) {
        formData.AircraftID = result.aircraftID; // Cập nhật lại AircraftID nếu là thêm mới
      }
      setAircrafts((prevAircrafts) => {
        if (selectedAircraft) {
          // Cập nhật bản ghi đã tồn tại
          return prevAircrafts.map((a) => (a.AircraftID === formData.AircraftID ? formData : a));
        } else {
          // Thêm mới bản ghi
          return [...prevAircrafts, formData];
        }
      });
      setIsFormOpen(false); // Đóng form
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error('Error submitting aircraft data:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Aircraft Management</h1>
      <button onClick={handleAddAircraft} className={styles.addButton}>Add Aircraft</button>
      <AircraftTable
        aircrafts={aircrafts}
        onEdit={handleEditAircraft}
        onDelete={handleDeleteAircraft}
      />
      {isFormOpen && (
        <AircraftForm
          aircraft={selectedAircraft}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </div>
  );
}
