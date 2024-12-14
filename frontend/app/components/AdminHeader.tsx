'use client'
import styles from "./styles/AdminHeader.module.css";
import Link from "next/link";

const Header = () => {

    return(
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link href="/admin/home">
                    <img 
                        src="/Logo/LogoS.png"
                        alt="Cloud Airlines Logo"
                        className={styles.logo}
                        // onClick={handleOptionClick}
                    />
                </Link>
            </div>
            <div className={styles.textContainer}>
                <h1 className={styles.text}>Administrator</h1>
            </div>
        </header>
    )
}

export default Header;

