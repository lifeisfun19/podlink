"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!formData.password || formData.password.length < 6) {
            setMessage("❌ Password must be at least 6 characters.");
            return;
        }

        try {
            const res = await fetch("/api/auth/custom-signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Signup successful! Redirecting...");
                setTimeout(() => router.push("/profile"), 2000); // or profile page
            } else {
                setMessage(`❌ ${data?.message || "Signup failed."}`);
                console.error("❌ Server Error:", data);
            }
        } catch (error) {
            console.error("🔥 Signup failed:", error);
            setMessage(`❌ ${error.message}`);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.banner}></h1>

            <div style={styles.signupBox}>
                <h2 style={styles.title}>Create Your Account</h2>
                {message && <p style={styles.message}>{message}</p>}

                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password (min 6 chars)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.signupButton}>
                        Sign Up
                    </button>
                </form>

                <p style={styles.text}>
                    Already have an account?{" "}
                    <a href="/welcome" style={styles.link}>
                        Log In
                    </a>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundImage:
            "url('https://getwallpapers.com/wallpaper/full/a/b/4/891455-wallpaper-of-study-2560x1440-for-hd-1080p.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        position: "relative",
    },
    banner: {
        fontSize: "3.5rem",
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        fontFamily: "'Algerian', sans-serif",
        width: "100%",
        position: "absolute",
        top: "30px",
        left: "50%",
        transform: "translateX(-50%)",
    },
    signupBox: {
        background: "rgba(255, 255, 255, 0.85)",
        padding: "2rem",
        borderRadius: "20px",
        boxShadow: "5px 5px 25px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        width: "85%",
        maxWidth: "420px",
        marginTop: "160px",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "1rem",
    },
    input: {
        width: "100%",
        padding: "12px",
        margin: "10px 0",
        borderRadius: "20px",
        border: "2px solid #ccc",
        fontSize: "1rem",
        textAlign: "center",
    },
    signupButton: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#ff6b6b",
        color: "#fff",
        fontSize: "1.2rem",
        fontWeight: "bold",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
        transition: "0.3s ease",
        marginTop: "10px",
    },
    text: {
        marginTop: "10px",
        fontSize: "1rem",
        color: "#555",
    },
    link: {
        color: "#2575fc",
        textDecoration: "none",
        fontWeight: "bold",
    },
    message: {
        color: "red",
        marginBottom: "10px",
        fontWeight: "bold",
    },
};
