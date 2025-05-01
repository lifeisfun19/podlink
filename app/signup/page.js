"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, GoogleAuthProvider, signInWithPopup } from "@/lib/firebase";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();

    if (!formData.password || formData.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/api/auth/custom-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          interests: [],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Signup successful! Redirecting...");
        setTimeout(() => router.push("/profile"), 2000);
      } else {
        setMessage(`❌ ${data?.message || "Something went wrong."}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage(`❌ ${error.message}`);
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
          interests: [],
          courses: [],
          location: { type: "Point", coordinates: [0, 0] },
        }),
      });

      if (res.ok) {
        setMessage("✅ Google signup successful! Redirecting...");
        setTimeout(() => router.push("/profile"), 2000);
      } else {
        const data = await res.json();
        setMessage(`❌ ${data?.message || "Sync failed."}`);
      }
    } catch (error) {
      console.error("Google signup error:", error);
      setMessage("❌ Google signup failed. Try again.");
    }
  };

  return (
      <div style={styles.container}>
        <div style={styles.signupBox}>
          <h2 style={styles.title}>Sign Up</h2>
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
            <Image src="/images/google.png" alt="Google" width={24} height={24} />
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
    minHeight: "100vh",
    backgroundImage:
        "url('https://getwallpapers.com/wallpaper/full/a/b/4/891455-wallpaper-of-study-2560x1440-for-hd-1080p.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Comic Sans MS, sans-serif",
  },
  signupBox: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: "2rem",
    borderRadius: "20px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "15px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  signupButton: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    backgroundColor: "#28a745",
    color: "white",
    borderRadius: "15px",
    border: "none",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  or: {
    margin: "15px 0",
    fontWeight: "bold",
  },
  googleButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    cursor: "pointer",
  },
  text: {
    marginTop: "1rem",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  message: {
    color: "red",
    marginBottom: "10px",
  },
};
