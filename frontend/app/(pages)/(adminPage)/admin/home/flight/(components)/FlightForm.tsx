import React, { useState } from "react";
import styles from "./styles/flightForm.module.css";
import { Flight } from "../flightObject";

type FlightFormProps = {
  flight: Flight | null;
  onClose: () => void;
  onSubmit: (flight: Flight) => void;
};

export default function FlightForm({ flight, onClose, onSubmit }: FlightFormProps) {
  const [formData, setFormData] = useState<Flight>({
    ID: flight?.ID || Date.now(),
    Aircraft: flight?.Aircraft || "",
    FlightHour: flight?.FlightHour || "",
    Departure: flight?.Departure || "",
    Arrival: flight?.Arrival || "",
    SeatAvailable: flight?.SeatAvailable || 0,
    Price: flight?.Price || 0,
    Status: flight?.Status || "Scheduled",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Gửi dữ liệu lên page chính
  };
  

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>{flight ? "Edit Flight" : "Add Flight"}</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>
            Aircraft:
            <input
              type="text"
              name="Aircraft"
              value={formData.Aircraft}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          <label className={styles.label}>
            Flight Hour:
            <input
              type="number"
              name="FlightHour"
              value={formData.FlightHour}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          <label className={styles.label}>
            Departure:
            <input
              type="text"
              name="Departure"
              value={formData.Departure}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          <label className={styles.label}>
            Arrival:
            <input
              type="text"
              name="Arrival"
              value={formData.Arrival}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          <label className={styles.label}>
            Seat Available:
            <input
              type="number"
              name="SeatAvailable"
              value={formData.SeatAvailable}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          <label className={styles.label}>
            Price:
            <input
              type="number"
              name="Price"
              value={formData.Price}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>
          <label className={styles.label}>
            Status:
            <textarea
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              className={styles.textarea}
              required
            />
          </label>
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
