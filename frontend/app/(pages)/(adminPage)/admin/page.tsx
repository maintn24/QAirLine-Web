'use client'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./adminLoginPage.module.css";

function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();  // Lấy query params từ URL
    const [showLoginRequired, setShowLoginRequired] = useState(false);

    useEffect(() => {
        // Kiểm tra query parameter 'loginRequired' trong URL
        if (searchParams.get('loginRequired') === 'true') {
            setShowLoginRequired(true);
        }
    }, [searchParams]);

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>Admin Login Page</h1>
                {showLoginRequired && <p className={styles.error}>Please log in to continue.</p>}
                <form>
                    <div className={styles.inputContainer}>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className={styles.input}
                            placeholder="Enter your Email"
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
    );
}

export default AdminLoginPage;
