'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth, GoogleAuthProvider, signInWithPopup } from '../lib/firebase';

export default function WelcomePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const res = await fetch('/api/auth/custom-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log("Sending POST request to /api/auth/login");

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed.');
      } else {
        setMessage('✅ Login successful! Redirecting...');
        router.push('/home');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const resultData = await response.json();

      if (response.ok) {
        localStorage.setItem('token', resultData.token);
        setMessage('✅ Google Sign-In successful! Redirecting...');
        setTimeout(() => router.push('/home'), 2000);
      } else {
        setError(resultData.message || 'Google Sign-In failed.');
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      setError(`❌ Error: ${error.message}`);
    }
  };

  return (
      <div style={styles.container}>
        <div style={styles.banner}>PODLINK</div>
        <form style={styles.loginBox} onSubmit={handleLogin}>
          <h2 style={styles.title}>Login to Your Account</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}

          <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
          <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.mainButton} type="submit">Login</button>

          <button type="button" onClick={handleGoogleSignIn} style={styles.googleButton}>
            <Image
                src="/images/google.png"
                alt="Google Icon"
                width={18}
                height={18}
                style={{ marginRight: '10px' }}
            />
            Sign in with Google
          </button>

          <Link href="/signup">
            <p style={styles.text}>
              Don&#39;t have an account? <span style={styles.link}>Sign up</span>
            </p>
          </Link>

          <button type="button" style={styles.resetButton}>Forgot Password</button>
        </form>
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
