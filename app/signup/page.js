"use client"; // For Next.js App Router
import { useState } from "react";
import { useRouter } from "next/navigation"; // 'next/router' if using Pages Router
import { auth, GoogleAuthProvider, signInWithPopup } from "../lib/firebase"; // Adjust the path based on your setup

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle regular email/password sign-up
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Signup successful! Redirecting...");
        setTimeout(() => router.push("/welcome"), 2000); // Redirect to welcome
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setMessage("❌ Signup failed. Try again.");
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      // Trigger Google sign-in popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google User:", user);

      // You can save additional user info to your database here (optional)
      // For example: createUserInDatabase(user);

      setMessage("✅ Google Sign-In successful! Redirecting...");
      setTimeout(() => router.push("/welcome"), 2000); // Redirect to welcome page
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.banner}>Welcome to PodLink</h1>

      <div style={styles.signupBox}>
        <h2 style={styles.title}>Create Your Account</h2>

        {message && <p style={{ color: "red" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
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

          <p style={styles.text}>
            Already have an account?{" "}
            <a href="/welcome" style={styles.link}>
              Log In
            </a>
          </p>

          {/* Google Sign-In Button */}
          <button type="button" onClick={handleGoogleSignIn} style={styles.googleButton}>
            <img
              src="https://www.vhv.rs/dpng/d/0-6167_google-app-icon-png-transparent-png.png"
              alt="Google Icon"
              style={styles.googleIconSmall}
            />
            Sign up with Google
          </button>
        </form>
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
  signupBox: {
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
