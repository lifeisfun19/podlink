'use client';
import { useEffect, useState } from "react";
import LeaderCard from "@/components/Leadercard.js"; // Correct component import (adjust if needed)

export default function LeadershipPage() {
    const [leaders, setLeaders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/leadership') // No need for `.js` in the URL
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch leadership data');
                }
                return res.json();
            })
            .then((data) => setLeaders(data))
            .catch((err) => setError(err.message));
    }, []);

    return (
        <div className="leadership-page">
            <h1 className="title">🏆 Leadership Board</h1>
            {error && <p className="error-message">Error: {error}</p>}
            <div className="leaders-container">
                {leaders.length === 0 && !error ? (
                    <p className="loading">Loading leaders...</p>
                ) : (
                    leaders.map((user, index) => (
                        <LeaderCard key={user._id} user={user} rank={index + 1} />
                    ))
                )}
            </div>

            <style jsx>{`
                .leadership-page {
                    min-height: 100vh;
                    padding: 3rem 1rem;
                    background-image: url('https://wallpapercave.com/wp/wp9432494.jpg');
                    background-size: cover;
                    background-position: center;
                    backdrop-filter: brightness(0.8);
                }

                .title {
                    text-align: center;
                    font-size: 3rem;
                    color: #ffffff;
                    margin-bottom: 2rem;
                    text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
                }

                .leaders-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 1.5rem;
                }

                .loading {
                    color: #ffffff;
                    font-size: 1.5rem;
                    text-align: center;
                }

                .error-message {
                    color: red;
                    text-align: center;
                }
            `}</style>
        </div>
    );
}
