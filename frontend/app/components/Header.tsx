'use client'
import React from "react";
import Link from "next/link";
import style from "./styles/Header.module.css";
import { useRouter } from 'next/navigation';


export default function Header (){
	const router = useRouter();
	const comeBackHomePage = () => {
        router.push(`/`);  // '/' là đường dẫn đến trang chủ
    };
return(
	<header className={style.header}>
		{/*Logo */}
		<div className={style.logo}>
				<img src="Image&Icon/Logo.png" style={{ cursor: 'pointer' }} alt="Cloud Airlines Logo" onClick={comeBackHomePage}></img>
		</div>
		<div className={style.container}>
			{/*Welcome, UserName*/} 
			<div className={style.welcome}>
					Welcome to Cloud Airlines!
			</div>
			{/*  Navigation */}
			<nav className={style.nav}>
				<ul className={style.navList}>
					<li>Book Flights</li>
					<li>Offers</li>
					<li>Manage Booking</li>
					<li>About</li>
					<li>Login| Register</li>
				</ul>
			</nav>
		</div>
	</header>
	
    )
}
