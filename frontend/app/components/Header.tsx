'use client'
import React from "react";
import { useState } from "react";
import {usePathname, useRouter} from 'next/navigation';
import style from "./styles/Header.module.css";
import SignIn_SignUp_PopUp from "@/app/components/SignIn_SignUp_PopUp";

export default function Header() {
	const [isVisible, setIsVisible] = useState(false);
	const handleLoginClick = () => {
		setIsVisible(true);
	};

	const router = useRouter();
	const currentRoute = usePathname()
	const toHomePage = () => {
		router.push(`/home`);
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

	return (
		<header className={style.header}>
			<div className={style.wrapper}>
				<div className={style.logo}>
					<img src="Image&Icon/LogoS.png" style={{cursor: 'pointer'}} alt="Cloud Airlines Logo"
						 onClick={toHomePage}/>
				</div>
				<div className={style.container}>
					<nav className={style.nav}>
						<ul className={style.navList}>
							<li className={currentRoute === '/home' ? style.active : ''}
								onClick={toHomePage}>Home</li>
							<li className={currentRoute === '/bookings' ? style.active : ''}
								onClick={toBookFlights}>Book Flights</li>
							<li className={currentRoute === '/offers' ? style.active : ''}
								onClick={toOffers}>Offers</li>
							<li className={currentRoute === '/manage-bookings' ? style.active : ''}
								onClick={toManageBooking}>Manage Booking</li>
							<li className={currentRoute === '/about' ? style.active : ''}
								onClick={toAbout}>About</li>
							<li onClick={handleLoginClick}>Login | Register</li>
						</ul>
					</nav>
					<SignIn_SignUp_PopUp visible={isVisible} setVisible={setIsVisible}/>
				</div>
			</div>
		</header>
	);
}