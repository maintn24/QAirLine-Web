'use client'
import React, {useState, useEffect} from 'react';
import styles from "./aircraftPage.module.css";
import AircraftTable from './(component)/AircraftTable';
import AircraftForm from './(component)/AircraftForm';

type Aircraft = {
  ID: number;
  Model: string;
  Manufacture: string;
  Capacity: number;
  Range: number;
  Description: string;
};

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

  const handleFormSubmit = (newAircraft: Aircraft) => {
    if (selectedAircraft) {
      // Edit existing aircraft
      setAircrafts(aircrafts.map((a) => (a.ID === newAircraft.ID ? newAircraft : a)));
    } else {
      // Add new aircraft
      setAircrafts([...aircrafts, newAircraft]);
    }
    setIsFormOpen(false);
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