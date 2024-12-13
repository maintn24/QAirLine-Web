import styles from "./adminLoginPage.module.css";

export default function AdminLoginPage(){
    return(
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>Admin Login Page</h1>
                <form>
                <div className={styles.inputContainer}>
                    <label htmlFor="username" className={styles.label}>
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className={styles.input}
                        placeholder="Enter your Username"
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="password" className={styles.label}>
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className={styles.input}
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className={styles.loginButton}>
                    Login
                </button>
            </form>
            </div>
        </div>
    )
}