// ForgotPasswordPage.js (Page to trigger reset email)
"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, sendPasswordResetEmail } from "../lib/firebase"; 

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
      setTimeout(() => router.push("/custom-login"), 2000); // Redirect to login page after 2 seconds
    } catch (error) {
      console.error("Firebase Reset Email Error:", error);
      setError(`❌ Reset failed: ${error.code} - ${error.message}`);

    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Email</button>
      </form>
    </div>
  );
}
