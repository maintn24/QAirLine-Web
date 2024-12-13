import styles from "./styles/AdminHeader.module.css";

const Header = () => {
    return(
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img 
                    src="/Logo/LogoS.png"
                    alt="Cloud Airlines Logo"
                    className={styles.logo}
                    // onClick={() => window.location.href = '/'
                />
            </div>
            <div className={styles.textContainer}>
                <h1 className={styles.text}>Administrator</h1>
            </div>
        </header>
    )
}

export default Header;

