import React from "react";
import Link from "next/link";
import style from "./UI/Header.module.css";

export default function Header ({ children }: { children?: React.ReactNode }){
return(
	<header className={style.header}>
		{/*Logo */}
		<div className={style.logo}>
				<img src="Image&Icon/Logo.png" alt="Cloud Airlines Logo" className="logo-image"></img>
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
