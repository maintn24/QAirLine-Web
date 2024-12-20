'use client'
import style from "./manage-bookings.module.css";
import React, { useState, useEffect } from "react";
import "@/app/global/global.css";
import {useRouter} from "next/navigation";

interface Ticket {
    BookingID: number;
    BookingDate: string;
    BookingStatus: string;
    PaymentStatus: string;
    FlightID: number;
    AircraftTypeID: number;
    Departure: string;
    Arrival: string;
    DepartureTime: string;
    ArrivalTime: string;
    Price: string;
    SeatsAvailable: number;
    FlightStatus: string;
}

const ManageBookings = () => {
    const [ticketList, setTicketList] = useState<Ticket[]>([]);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuthentication = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/home');
            }
        }
        const fetchBookings = async () => {
            if (localStorage.getItem('userid') !== null) {
                const userID = localStorage.getItem('userid');
                try {
                    const response = await fetch('http://localhost:3001/api/Flights/GetUserFlights', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userID }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setTicketList(data);
                    } else {
                        console.error('Failed to fetch bookings:', data);
                    }
                } catch (error) {
                    console.error('Error fetching bookings:', error);
                }
            }
        };
        checkAuthentication()
        fetchBookings();
    }, []);

    const executeCheckin = (id: number) => {
        setTicketList(ticketList.map(ticket =>
            ticket.BookingID === id ? { ...ticket, BookingStatus: 'checked-in' } : ticket
        ));
        alert('Check-in successful!');
    }

    const executeCancel = (id: number) => {
        setTicketList(ticketList.map(ticket =>
            ticket.BookingID === id ? { ...ticket, BookingStatus: 'cancelled' } : ticket
        ));
        alert('Booking cancelled!');
    }

    return (
        <div className={style.container}>
            <h1 className={style.title}>My Booking</h1>
            <ul className={style.ticketlist}>
                {ticketList.map((ticket) => (
                    <li key={ticket.BookingID} className={style.ticketitem}>
                        <div className={style.column}>
                            <strong>{ticket.Departure}</strong> → <strong>{ticket.Arrival}</strong>
                            <div>
                                {ticket.DepartureTime} → {ticket.ArrivalTime}
                            </div>
                        </div>
                        <div className={style.column}>
                            <div>
                                Flight duration: {ticket.DepartureTime} → {ticket.ArrivalTime}
                            </div>
                            <div>
                                Plane: {ticket.AircraftTypeID}
                            </div>
                        </div>
                        <div className={style.column}>
                            <div>
                                Status: <strong>{ticket.BookingStatus}</strong>
                            </div>
                            <div>
                                Seat: {ticket.SeatsAvailable}
                            </div>
                            <div>
                                Price: ${ticket.Price}
                            </div>
                        </div>
                        <div className={style.column}>
                            <div>
                                <button className={style.checkinbutton} onClick={() => executeCheckin(ticket.BookingID)}>Check-in</button>
                            </div>
                            <div>
                                <button className={style.cancelbutton} onClick={() => executeCancel(ticket.BookingID)}>Cancel</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ManageBookings;