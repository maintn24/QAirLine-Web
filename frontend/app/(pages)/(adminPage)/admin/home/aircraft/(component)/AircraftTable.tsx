import React from "react";
import styles from './styles/aircraftTable.module.css';
import { Chocolate_Classical_Sans } from "next/font/google";
import { Aircraft } from "../aircraftObject";

type aircraftTableProps = {
    aircrafts: Aircraft[];
    onEdit: (aircraft: Aircraft) => void;
    onDelete: (id:number) => void;
}

export default function AircraftTable({aircrafts, onEdit, onDelete}: aircraftTableProps){
    return(
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Model</th>
                    <th>Manufacture</th>
                    <th>Capacity</th>
                    <th>Range</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {aircrafts.map((aircraft) => (
                    <tr key={aircraft.ID}>
                        <td>{aircraft.ID}</td>
                        <td>{aircraft.Model}</td>
                        <td>{aircraft.Manufacture}</td>
                        <td>{aircraft.Capacity}</td>
                        <td>{aircraft.Range}</td>
                        <td>{aircraft.Description}</td>
                        <td>
                            <button onClick={()=> onEdit(aircraft)} className={styles.editButton}>Edit</button>
                            <button onClick={()=> onDelete(aircraft.ID)} className={styles.deleteButton}>Delete</button>
                        </td>
                    </tr>
                ) )}
            </tbody>
        </table>
    )
}