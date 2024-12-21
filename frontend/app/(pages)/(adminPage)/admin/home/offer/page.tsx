'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./createOfferPage.module.css";

function CreateOfferPage() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

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

    // Kiểm tra token khi trang load
    useEffect(() => {
        const userID = getUserIDFromToken();
        if (!userID) {
            setError("User is not authenticated. Please log in again.");
            setLoading(false);
            router.push("/admin?loginRequired=true"); // Redirect to /admin if no valid token
            return;
        }

        setIsAuthenticated(true);
        setLoading(false); // Sau khi kiểm tra xong, set loading là false
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset trạng thái lỗi và thành công
        setError(null);
        setSuccessMessage(null);

        if (!isAuthenticated) {
            setError("User is not authenticated. Please log in again.");
            return;
        }

        if (!title || !description) {
            setError("Title and description are required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/api/Offers/CreateOffer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content: description,
                    userID: JSON.parse(localStorage.getItem("token") || "{}").userid, // Using token to get userID
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(`Offer created successfully`);
                setTitle(""); // Reset title
                setDescription(""); // Reset description
            } else {
                setError(data.message || "Failed to create offer. Please try again.");
            }
        } catch (error) {
            setError("An unexpected error occurred. Please try again later.");
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Render loading khi đang kiểm tra token
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Create a New Offer</h1>
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="title" className={styles.label}>
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.input}
                            placeholder="Enter offer title"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="description" className={styles.label}>
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.textarea}
                            placeholder="Enter offer description"
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    {successMessage && <p className={styles.success}>{successMessage}</p>}
                    <button type="submit" className={styles.submitButton}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateOfferPage;
