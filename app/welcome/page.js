"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WelcomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      router.push("/home");
    } else {
      alert("Please enter both email and password.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Welcome to PodLink - Top Header */}
      <h1 style={styles.banner}>Welcome to PodLink</h1>

      {/* Login Section */}
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Let's Get Started! 🚀</h2>

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

        {/* Google Sign-Up Button */}
        <button style={styles.googleButton}>
          <img
            src="https://www.vhv.rs/dpng/d/0-6167_google-app-icon-png-transparent-png.png"
            alt="Google Icon"
            style={styles.googleIconSmall}
          />
          Sign up with Google
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
    background: "rgba(255, 255, 255, 0.7)", // Translucent white
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
};

