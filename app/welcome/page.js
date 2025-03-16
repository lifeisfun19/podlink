"use client"; // For Next.js App Router
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "../lib/firebase"; // Import Firebase methods

export default function WelcomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials.");
        return;
      }

      // Store the JWT token (in localStorage or cookies)
      localStorage.setItem("token", data.token);

      // Redirect to Home
      router.push("/home");
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();

    try {
      // Trigger Google sign-in popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google User:', user);

      // Store JWT token or additional user data here
      setMessage("✅ Signup successful! Redirecting...");
      setTimeout(() => router.push("/home"), 2000); // Redirect to home after successful login

    } catch (error) {
      console.error("Error during Google Sign-Up:", error);
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset the password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ A password reset link has been sent to your email.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.banner}>Welcome to PodLink</h1>

      <div style={styles.loginBox}>
        <h2 style={styles.title}>Let's Get Started! 🚀</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <input
          type="email"
          placeholder="Enter your email 📧"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter your password 🔒"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.mainButton} onClick={handleLogin}>
          🌟 Get Started
        </button>

        <p style={styles.text}>
          New here?{" "}
          <a href="/signup" style={styles.link}>
            Create an Account
          </a>
        </p>

        <button style={styles.googleButton} onClick={handleGoogleSignUp}>
          <img
            src="https://www.vhv.rs/dpng/d/0-6167_google-app-icon-png-transparent-png.png"
            alt="Google Icon"
            style={styles.googleIconSmall}
          />
          Sign up with Google
        </button>

        <button style={styles.resetButton} onClick={handleResetPassword}>
          Reset Password
        </button>
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
    height: "100vh",
    backgroundImage:
      "url('https://getwallpapers.com/wallpaper/full/a/b/4/891455-wallpaper-of-study-2560x1440-for-hd-1080p.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    position: "relative",
  },
  banner: {
    fontSize: "4rem",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontFamily: "'Algerian', sans-serif",
    width: "100%",
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
  },
  loginBox: {
    background: "rgba(255, 255, 255, 0.7)",
    padding: "2rem",
    borderRadius: "20px",
    boxShadow: "5px 5px 20px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: "80%",
    maxWidth: "400px",
    marginTop: "120px",
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
  mainButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ff6b6b",
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "0.3s",
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
  googleButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#fff",
    border: "2px solid #ccc",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginTop: "10px",
  },
  googleIconSmall: {
    width: "18px",
    height: "18px",
    marginRight: "10px",
  },
  resetButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#00BFFF",
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "0.3s",
    marginTop: "10px",
  },
};
