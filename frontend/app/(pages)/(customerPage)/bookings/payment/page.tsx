'use client'
import React, {Suspense, useEffect, useState} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import style from './payment.module.css';

const PaymentPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [UserID, setUserID] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const FlightID = searchParams.get('flightID');
    const departure = searchParams.get('departure');
    const arrival = searchParams.get('arrival');
    const departureTime = searchParams.get('departureTime');
    const arrivalTime = searchParams.get('arrivalTime');
    const duration = searchParams.get('duration');
    const price = searchParams.get('price');
    const planeType = searchParams.get('planeType')

    useEffect(() => {
        setUserID(localStorage.getItem('userid'));
        const checkAuthentication = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/home');
            }
        }
        checkAuthentication()
    }, []);

    const handlePurchase = async () => {
        alert('Purchase button clicked');
        console.log('Payment Flight ID:', FlightID);
        console.log('Payment User ID:', UserID);
        // Reset error state
        setError(null);

        if (!UserID || !FlightID) {
            alert('User ID or Flight ID is missing');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/Bookings/BookFlights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({UserID, FlightID}),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Purchase successful!' + data.bookingID);
                console.log(data);
                router.push('/bookings/search');
            } else {
                setError(`Purchase failed: ${data.message}`);
            }
        } catch (error) {
            setError('Error during purchase');
            alert('An error occurred during the purchase.');
        }

    };

    return (
        <div className={style.payment}>
            <h1>Payment</h1>
            <h2>{error}</h2>
            <div>Flight infomation</div>
            <div className={style.flightInfo}>
                <div className={style.column}>
                    <div><strong>Departure: {departure}</strong> → <strong> Arrival: {arrival}</strong></div>
                    <div>
                        <strong>Time: </strong>{departureTime} → {arrivalTime}
                    </div>
                </div>
                <div className={style.column}>
                    <div>
                        <strong>Flight duration: </strong>{duration}
                    </div>
                    <div>
                        <strong>Plane: </strong>{planeType}
                    </div>
                </div>
                <div className={style.column}>
                    <strong>Price: ${price}</strong>
                </div>
            </div>
            <button onClick={handlePurchase} className={style.purchaseButton}>Purchase</button>
        </div>
    );
};

const WrappedPaymentPage = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <PaymentPage />
    </Suspense>
);

export default WrappedPaymentPage;