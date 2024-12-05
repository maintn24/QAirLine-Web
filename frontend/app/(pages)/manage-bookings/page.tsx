'use client'
import style from "./manage-bookings.module.css";
import React, { useState } from "react";
import "@/app/global/global.css";

interface Ticket {
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
    seatType: "Economy" | "Business";
    status: "Booked" | "Checked-in" | "Cancelled" | "Completed";
    seatNumber: string;
}

const TicketList: Ticket[] = [
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
        seatType: 'Economy',
        status: 'Booked',
        seatNumber: '12A',
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
        seatType: 'Business',
        status: 'Checked-in',
        seatNumber: '1B',
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
        seatType: 'Economy',
        status: 'Cancelled',
        seatNumber: '22C',
    },
    {
        id: '4',
        startTime: '09:00 AM',
        arriveTime: '11:30 AM',
        startDate: '2024-12-18',
        arriveDate: '2024-12-18',
        startDestination: 'Boston (BOS)',
        arriveDestination: 'Washington D.C. (DCA)',
        duration: '2h 30m',
        planeType: 'Boeing 737',
        price: 180,
        seatType: 'Business',
        status: 'Completed',
        seatNumber: '3D',
    },
    {
        id: '5',
        startTime: '07:00 AM',
        arriveTime: '09:00 AM',
        startDate: '2024-12-19',
        arriveDate: '2024-12-19',
        startDestination: 'Houston (IAH)',
        arriveDestination: 'Denver (DEN)',
        duration: '2h 00m',
        planeType: 'Airbus A320',
        price: 220,
        seatType: 'Economy',
        status: 'Booked',
        seatNumber: '15E',
    }
];

const ManageBookings = () => {
    return (
        <div className={style.container}>
            <h1 className={style.title}>Manage Bookings</h1>
            <ul className={style.ticketlist}>
                {TicketList.map((ticket) => (
                    <li className={style.ticketitem} key={ticket.id}>
                        <div>
                            <div className={style.column}>
                                <div>
                                    {ticket.id}
                                </div>
                                <div>
                                    {ticket.startDestination} to {ticket.arriveDestination}
                                </div>
                                <div>{ticket.startDate} {ticket.startTime} - {ticket.arriveDate} {ticket.arriveTime}</div>
                            </div>
                            <div className={style.column}>
                                <div>{ticket.duration}</div>
                                <div>{ticket.planeType}</div>
                                <div>{ticket.price}</div>
                                <div>{ticket.seatType}</div>
                                <div>{ticket.seatNumber}</div>
                            </div>
                            <div className={style.column}>
                                <div>{ticket.status}</div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ManageBookings;