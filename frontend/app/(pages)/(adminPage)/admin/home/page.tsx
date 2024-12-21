'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./adminHomePage.module.css";

// Hàm giải mã token và lấy userID
const getUserIDFromToken = () => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (!token) {
        return null; // Nếu không có token, trả về null
    }

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Giải mã payload của JWT
        return decodedToken?.userid || null; // Trả về userID nếu có
    } catch (error) {
        console.error("Error decoding token:", error);
        return null; // Nếu giải mã lỗi, trả về null
    }
};

function HomePage() {
    const router = useRouter();

    // Kiểm tra token và điều hướng nếu không có userID
    useEffect(() => {
        const userID = getUserIDFromToken();
        if (!userID) {
            // Nếu không có userID, điều hướng về trang /admin
            router.push("/admin");
        }
    }, [router]);

    return (
        <div>
            <div className={styles.blogContainer}>
                <h1 className={styles.title}>Choose To Manage</h1>
            </div>
        </div>
    );
}

export default HomePage;
