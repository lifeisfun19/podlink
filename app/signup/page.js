// File: app/signup/page.js

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import Image from "next/image";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
      );
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: formData.name });

      const token = await firebaseUser.getIdToken();

      const res = await fetch("/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          firebaseUid: firebaseUser.uid,
          avatar: firebaseUser.photoURL || "",
          bio: "",
          interests: [],
          courses: [],
          location: { type: "Point", coordinates: [0, 0] },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Signup successful! Redirecting...");
        setTimeout(() => router.push("/profile"), 2000);
      } else {
        setMessage(`❌ ${data?.error || "Backend error"}`);
        console.error("❌ Sync Error:", data);
      }
    } catch (error) {
      console.error("🔥 Signup failed:", error);
      setMessage("❌ Signup failed. Please try again.");
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const res = await fetch("/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.displayName || "Unnamed",
          email: user.email,
          firebaseUid: user.uid,
          avatar: user.photoURL || "",
          bio: "",
          interests: [],
          courses: [],
          location: { type: "Point", coordinates: [0, 0] },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Google signup successful! Redirecting...");
        setTimeout(() => router.push("/profile"), 2000);
      } else {
        setMessage(`❌ ${data?.error || "Backend error"}`);
        console.error("❌ Sync Error:", data);
      }
    } catch (error) {
      console.error("❌ Google signup failed:", error);
      setMessage("❌ Google signup failed. Please try again.");
    }
  };

  return (
      <div style={styles.container}>
        <h1 style={styles.banner}></h1>

        <div style={styles.signupBox}>
          <h2 style={styles.title}>Create Your Account</h2>
          {message && <p style={styles.message}>{message}</p>}

          <form onSubmit={handleEmailSignup}>
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
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
            />
            <button type="submit" style={styles.signupButton}>
              Sign Up
            </button>
          </form>

          <p style={styles.or}>— or —</p>

          <button onClick={handleGoogleSignup} style={styles.googleButton}>
            <Image
                src="/images/google.png"
                alt="Google"
                width={24}
                height={24}
                style={styles.googleIcon}
            />

            Sign up with Google
          </button>

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
    minHeight: "100vh", // FIXED background height
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
  googleButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "white", // updated
    color: "black",           // updated
    fontSize: "1.2rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "0.3s ease",
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  googleIcon: {
    width: "24px",
    height: "24px",
  },
  or: {
    margin: "20px 0 10px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#666",
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
