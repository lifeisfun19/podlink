// noinspection DuplicatedCode

"use client";
import { useState, useEffect } from "react";

export default function Matching({ userId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`/api/match?userId=${userId}`);
        const data = await res.json();
        if (res.ok) {
          setMatches(data);
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Your Matches</h2>
      {matches.length > 0 ? (
        <ul>
          {matches.map((user) => (
            <li key={user._id}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches found.</p>
      )}
    </div>
  );
}
