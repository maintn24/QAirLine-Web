import React, { useState } from 'react';
import styles from './styles/aircraftForm.module.css';
import { Aircraft } from '../aircraftObject';

type AircraftFormProps = {
    aircraft: Aircraft | null;
    onClose: () => void;
    onSubmit: (aircraft: Aircraft) => void;
};

export default function AircraftForm({aircraft, onClose, onSubmit}: AircraftFormProps){
    const [formData, setFormData] = useState<Aircraft>({
        ID: aircraft?.ID || Date.now(),
        Model: aircraft?.Model || '',
        Manufacture: aircraft?.Manufacture || '',
        Capacity: aircraft?.Capacity || 0,
        Range: aircraft?.Range || 0,
        Description: aircraft?.Description || '',
    })

    const handleChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const method = aircraft?.ID ? 'PUT' : 'POST'; // Nếu có ID thì update, nếu không thì thêm mới
        const url = aircraft?.ID ? `/api/aircrafts/${aircraft.ID}` : '/api/aircrafts';
    
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log(result.message || 'Success'); // Log thông báo từ server
    
                onSubmit(result.aircraft || formData); // Cập nhật state ở component cha
                onClose(); // Đóng form
            } else {
                console.error('Error saving aircraft');
            }
        } catch (error) {
            console.error('Error during submission:', error);
        }
    };

    return(
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>{aircraft?'Edit Aircraft':'Add Aircraft'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Model:
                        <input 
                            type='text' 
                            name='Model' 
                            value={formData.Model} 
                            onChange={handleChange} 
                            className={styles.inputField}
                            required
                        />
                    </label>
                    <label>
                        Manufacture:
                        <input 
                            type="text" 
                            name="Manufacture" 
                            value={formData.Manufacture} 
                            onChange={handleChange} 
                            className={styles.inputField}
                            required 
                        />
                    </label>
                    <label>
                        Capacity:
                        <input 
                            type="number" 
                            name="Capacity" 
                            value={formData.Capacity} 
                            onChange={handleChange}
                            className={styles.inputField}
                            required 
                        />
                    </label>
                    <label>
                        Range:
                        <input 
                            type="number" 
                            name="Range" 
                            value={formData.Range} 
                            onChange={handleChange} 
                            className={styles.inputField}
                            required 
                        />
                    </label>
                    <label>
                        Description:
                        <textarea 
                            name="Description" 
                            value={formData.Description} 
                            onChange={handleChange}
                            className={styles.inputField} 
                            required 
                        />
                    </label>
                    <div className={styles.buttons}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                        <button type="submit" className={styles.submitButton}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}