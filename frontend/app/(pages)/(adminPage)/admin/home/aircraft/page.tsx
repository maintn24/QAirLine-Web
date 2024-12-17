'use client'
import React, {useState, useEffect} from 'react';
import styles from "./aircraftPage.module.css";
import AircraftTable from './(component)/AircraftTable';
import AircraftForm from './(component)/AircraftForm';
import { Aircraft } from './aircraftObject';


export default function AircraftManagementPage() {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);

  // Fetch data từ API
  useEffect(() => {
    async function fetchAircrafts() {
      try {
        const response = await fetch('/api/aircrafts');
        const data = await response.json();
        setAircrafts(data);
      } catch (error) {
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
      await fetch(`/api/aircrafts/${id}`, { method: 'DELETE' });
      setAircrafts(aircrafts.filter((a) => a.ID !== id));
    } catch (error) {
      console.error('Error deleting aircraft:', error);
    }
  };

  const handleFormSubmit = async (formData: Aircraft) => {
    try {
      const method = selectedAircraft ? 'PUT' : 'POST';
      const url = selectedAircraft
        ? `/api/aircrafts/${formData.ID}` // Update aircraft
        : '/api/aircrafts'; // Add new aircraft
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error('Failed to save aircraft');
  
      const savedAircraft = await response.json();
  
      setAircrafts((prevAircrafts) => {
        if (selectedAircraft) {
          // Cập nhật bản ghi đã tồn tại
          return prevAircrafts.map((a) => (a.ID === savedAircraft.ID ? savedAircraft : a));
        } else {
          // Thêm mới bản ghi
          return [...prevAircrafts, savedAircraft];
        }
      });
  
      setIsFormOpen(false); // Đóng form
    } catch (error) {
      console.error('Error submitting aircraft data:', error);
    }
  };
  

  return(
    <div className={styles.container}>
      <h1 className={styles.title}>Aircraft Management</h1>
      <button onClick={handleAddAircraft} className={styles.addButton}>Add Aircraft</button>
      <AircraftTable
        aircrafts={aircrafts}
        onEdit={handleEditAircraft}
        onDelete={handleDeleteAircraft}
      />
      {isFormOpen&&(
        <AircraftForm
          aircraft={selectedAircraft}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}