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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData); // Gửi dữ liệu lên page chính
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