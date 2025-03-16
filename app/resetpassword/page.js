// ResetPasswordPage.js
"use client"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, confirmPasswordReset } from "../lib/firebase"; // Ensure correct import of confirmPasswordReset

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState(""); // store the oobCode
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Get the code from the query parameters in the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get("oobCode"); // Extract oobCode from URL
    if (codeFromUrl) {
      setCode(codeFromUrl);
    } else {
      setError("Invalid or missing code.");
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter both new password and confirmation.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Verify the code and reset the password
      await confirmPasswordReset(auth, code, newPassword);
      setMessage("✅ Password successfully reset! You can now log in with your new password.");
      setTimeout(() => router.push("/login"), 2000); // Redirect to login after successful password reset
    } catch (error) {
      console.error("Error resetting password:", error);
      setError(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.banner}>Reset Your Password</h1>

      <div style={styles.loginBox}>
        <h2 style={styles.title}>Set a New Password 🔒</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <input
          type="password"
          placeholder="Enter your new password 🔑"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Confirm your new password 🔑"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.mainButton} onClick={handleResetPassword}>
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
};
