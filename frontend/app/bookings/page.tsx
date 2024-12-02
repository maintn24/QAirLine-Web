'use client'
import React, {useState} from 'react'
import styles from './bookings.module.css'

interface Flight {
    id: string;
    startTime: string;
    arriveTime: string;
    startDate: string;
    arriveDate: string;
    startDestination: string;
    arriveDestination: string;
    duration: string;
    planeType: string;
    price: number;
}

const flights: Flight[] = [
    {
        id: '1',
        startTime: '08:00 AM',
        arriveTime: '10:00 AM',
        startDate: '2024-12-15',
        arriveDate: '2024-12-15',
        startDestination: 'New York (JFK)',
        arriveDestination: 'Los Angeles (LAX)',
        duration: '5h 30m',
        planeType: 'Boeing 737',
        price: 300,
    },
    {
        id: '2',
        startTime: '01:00 PM',
        arriveTime: '04:30 PM',
        startDate: '2024-12-16',
        arriveDate: '2024-12-16',
        startDestination: 'Chicago (ORD)',
        arriveDestination: 'Miami (MIA)',
        duration: '3h 30m',
        planeType: 'Airbus A320',
        price: 200,
    },
    {
        id: '3',
        startTime: '06:00 PM',
        arriveTime: '08:45 PM',
        startDate: '2024-12-17',
        arriveDate: '2024-12-17',
        startDestination: 'San Francisco (SFO)',
        arriveDestination: 'Seattle (SEA)',
        duration: '2h 45m',
        planeType: 'Boeing 757',
        price: 150,
    },
    {
        id: '4',
        startTime: '06:00 PM',
        arriveTime: '08:45 PM',
        startDate: '2024-12-18',
        arriveDate: '2024-12-18',
        startDestination: 'San Francisco (SFO)',
        arriveDestination: 'Seattle (SEA)',
        duration: '2h 45m',
        planeType: 'Boeing 757',
        price: 150,
    },
    {
        id: '5',
        startTime: '06:00 PM',
        arriveTime: '08:45 PM',
        startDate: '2024-12-15',
        arriveDate: '2024-12-15',
        startDestination: 'San Francisco (SFO)',
        arriveDestination: 'Seattle (SEA)',
        duration: '2h 45m',
        planeType: 'Boeing 757',
        price: 150,
    }
];


const FlightBooking: React.FC = () => {
    const allStartDestinations = [...new Set(flights.map((flight) => flight.startDestination))];
    const allArriveDestinations = [...new Set(flights.map((flight) => flight.arriveDestination))];
    const [search, setSearch] = useState({
        startDestination: '',
        arriveDestination: '',
        startDate: '',
        arriveDate: '',
        startDestinationOptions: allStartDestinations,
        arriveDestinationOptions: allArriveDestinations,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearch((prev) => ({ ...prev, [name]: value }));
    };

    const filteredFlights = flights.filter(
        (flight) =>
            (!search.startDestination || flight.startDestination.toLowerCase().includes(search.startDestination.toLowerCase())) &&
            (!search.arriveDestination || flight.arriveDestination.toLowerCase().includes(search.arriveDestination.toLowerCase())) &&
            (!search.startDate || flight.startDate.includes(search.startDate)) &&
            (!search.arriveDate|| flight.arriveDate.includes(search.arriveDate))
    );

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Flight Booking</h1>
            <div className={styles.searchBar}>
                <select
                    name="startDestination"
                    value={search.startDestination}
                    onChange={handleInputChange}
                >
                    <option value="">Start Destination</option>
                    {search.startDestinationOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <select
                    name="arriveDestination"
                    value={search.arriveDestination}
                    onChange={handleInputChange}
                >
                    <option value="">Arrive Destination</option>
                    {search.arriveDestinationOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="startDate"
                    placeholder="Start Date"
                    value={search.startDate}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="arriveDate"
                    placeholder="Arrive Date"
                    value={search.arriveDate}
                    onChange={handleInputChange}
                />
            </div>
            <ul className={styles.flightlist}>
                {filteredFlights.map((flight) => (
                    <li key={flight.id} className={styles.flightitem}>
                        <div className={styles.column}>
                            <strong>{flight.startDestination}</strong> → <strong>{flight.arriveDestination}</strong>
                            <div>
                                {flight.startDate} → {flight.arriveDate}
                            </div>
                        </div>
                        <div className={styles.column}>
                            <div>
                                {flight.startTime} → {flight.arriveTime}
                            </div>
                            <div>
                                Flight duration: {flight.duration}
                            </div>
                            <div>
                                Plane: {flight.planeType}
                            </div>
                        </div>
                        <div className={styles.column}>
                            <button className={styles.purchasebutton}>Economy: ${flight.price}</button>
                            <button className={styles.purchasebutton}>Business: ${flight.price}</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FlightBooking;
