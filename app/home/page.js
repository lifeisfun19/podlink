"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/match");
        if (!res.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await res.json();
        setMatches(data.matches);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background:
          "url('https://getwallpapers.com/wallpaper/full/1/6/f/891597-best-wallpaper-of-study-2560x1600-notebook.jpg') center/cover no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "white",
        }}
      >
        Explore study pods and collaborate with students!
      </h1>

      {loading && <p style={{ color: "white" }}>Loading matches...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "10px",
          width: "60%",
          textAlign: "center",
        }}
      >
        <h2>Matched Study Pods</h2>
        {matches.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {matches.map((match, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {match.name} - {match.subject}
              </li>
            ))}
          </ul>
        ) : (
          <p>No matches found. Try updating your preferences!</p>
        )}
      </div>
    </div>
  );
}
