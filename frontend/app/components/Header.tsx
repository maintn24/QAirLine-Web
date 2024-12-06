'use client'
import React from "react";
import { useState } from "react";
import Link from "next/link";
import style from "./styles/Header.module.css";
import { useRouter } from 'next/navigation';
import SignIn_SignUp_PopUp from "@/app/components/SignIn_SignUp_PopUp";

export default function Header (){
	// Hiển thị popup khi click vào Login/Register
	const [isVisible, setIsVisible] = useState(false);
	const handleLoginClick = () => {
		setIsVisible(true);
	};
	const router = useRouter();
	const toHomePage = () => {
		router.push(`/`);
	};
	const toBookFlights = () => {
		router.push(`/bookings`);
	};
	const toManageBooking = () => {
		router.push(`/manage-bookings`);
	};
	const toOffers = () => {
		router.push(`/offers`);
	};
	const toAbout = () => {
		router.push(`/about`);
	};
	return(
		<header className={style.header}>
			{/*Logo */}
			<div className={style.logo}>
				<img src="Image&Icon/Logo.png" style={{ cursor: 'pointer' }} alt="Cloud Airlines Logo" onClick={toHomePage}></img>
			</div>
			<div className={style.container}>
				{/*Welcome, UserName*/}
				<div className={style.welcome}>
					Welcome to Cloud Airlines!
				</div>
				{/*  Navigation */}
				<nav className={style.nav}>
					<ul className={style.navList}>
						<li onClick={toHomePage}>Home</li>
						<li onClick={toBookFlights}>Book Flights</li>
						<li onClick={toOffers}>Offers</li>
						<li onClick={toManageBooking}>Manage Booking</li>
						<li onClick={toAbout}>About</li>
						<li onClick={handleLoginClick}>Login| Register</li>
					</ul>
				</nav>
				<SignIn_SignUp_PopUp visible={isVisible} setVisible={setIsVisible} />
			</div>
		</header>

	)
}