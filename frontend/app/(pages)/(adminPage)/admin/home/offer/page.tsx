'use client'
import { useState } from "react";
import styles from "./createOfferPage.module.css";
import adminAuthRoute from "@/app/components/AuthCheck";

function CreateOfferPage() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset trạng thái lỗi và thành công
        setError(null);
        setSuccessMessage(null);

        // Lấy UserID từ localStorage
        const decodedToken = localStorage.getItem("decodedToken");
        if (!decodedToken) {
            setError("User is not authenticated. Please log in again.");
            return;
        }

        const { userid } = JSON.parse(decodedToken);

        if (!userid) {
            setError("User ID is missing from token. Please log in again.");
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
                    userID: userid,
                }),
            });

            const data = await response.json();
            console.log(data);
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

export default (CreateOfferPage);