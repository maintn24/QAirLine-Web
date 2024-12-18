'use client'
import styles from "./adminLoginPage.module.css";
import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import {jwtDecode, JwtPayload} from "jwt-decode";

export default function AdminLoginPage(){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        localStorage.clear();
        e.preventDefault();

        // Reset error state
        setError(null);

        if (!email || !password) {
            console.error('All fields are required for signin');
            return;
        }
        try {
            const response = await fetch('http://localhost:3001/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                const decoded = jwtDecode<JwtPayload & { role?: string }>(data.token);
                alert('Signin successful');
                router.push('/admin/home');

            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            setError('Something went wrong. Please try again later.' + error);
        }
    };


    return(
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>Admin Login Page</h1>
                <form onSubmit={handleSubmit}>
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {/* Hiển thị lỗi nếu có */}
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.loginButton}>
                    Login
                </button>
            </form>
            </div>
        </div>
    )
}