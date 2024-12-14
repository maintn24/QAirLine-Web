'use client'
import styles from "./adminLoginPage.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Hiển thị lỗi
    const router = useRouter();

    const handleSubmit: React.FormEventHandler = async (e) => {
        e.preventDefault(); // Ngăn form reload trang
        setError(""); // Reset lỗi cũ

        try {
            const response = await fetch("http://localhost:3001/auth/signin", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Kiểm tra role admin
                if (data.role === "admin") {
                    alert("Login successful! Redirecting...");
                    router.push("/admin/home"); // Chuyển hướng đến trang admin
                }else {
                    setError("You are not authorized to access this page.");
                }
            } else {
                setError(data.message || "Invalid username or password.");
            }   
        }catch (err) {
            setError("An error occurred. Please try again later.");
        }
    }


    return(
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>Admin Login Page</h1>
                <form onSubmit={handleSubmit}>
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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