"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, confirmPasswordReset } from "../lib/firebase"; // Ensure correct import

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState(""); // Store the oobCode
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Ensure oobCode is retrieved correctly
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

    if (!code) {
      setError("Missing reset code. Please request a new password reset.");
      return;
    }

    try {
      await confirmPasswordReset(auth, code, newPassword);
      setMessage("✅ Password successfully reset! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setError(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
