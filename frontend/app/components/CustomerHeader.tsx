'use client'
import React from "react";
import { useState } from "react";
import {usePathname, useRouter} from 'next/navigation';
import style from "./styles/CustomerHeader.module.css";
import AuthenticationPopUp from "@/app/components/AuthenticationPopUp";

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
		router.push(`/bookings/search`);
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
					<img src={`/Logo/LogoS.png`} style={{cursor: 'pointer'}} alt="Cloud Airlines Logo"
						 onClick={toHomePage}/>
				</div>
				<div className={style.container}>
					<nav className={style.nav}>
						<ul className={style.navList}>
							<li className={currentRoute === '/home' ? style.active : ''}
								onClick={toHomePage}>Home</li>
							<li className={currentRoute === '/bookings/search' ? style.active : ''}
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
					<AuthenticationPopUp visible={isVisible} setVisible={setIsVisible}/>
				</div>
			</div>
		</header>
	);
}