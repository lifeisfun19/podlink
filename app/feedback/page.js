'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase'; // Import your Firebase config

export default function FeedbackPage() {
    const [message, setMessage] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch existing feedbacks
    useEffect(() => {
        async function fetchFeedbacks() {
            const res = await fetch('/api/feedback');
            const data = await res.json();
            setFeedbacks(data);
        }

        fetchFeedbacks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Get the user ID from Firebase Authentication
        const user = auth.currentUser;

        if (!user) {
            alert('User not authenticated!');
            setLoading(false);
            return;
        }

        const userId = user.uid; // Get current user's UID

        const res = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, message }),
        });

        const data = await res.json();

        if (data.success) {
            setFeedbacks((prev) => [...prev, data.feedback]);
            setMessage('');
        } else {
            alert('Error submitting feedback');
        }

        setLoading(false);
    };

    return (
        <div className="feedback-page">
            <h1 className="title">📣 Submit Your Feedback</h1>
            <form onSubmit={handleSubmit} className="feedback-form">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your feedback..."
                    required
                />
                <button type="submit" disabled={loading}>Submit Feedback</button>
            </form>

            <div className="feedback-list">
                <h2 className="list-title">Feedback from Users:</h2>
                {feedbacks.map((feedback) => (
                    <div key={feedback._id} className="feedback-card">
                        <p><strong>{feedback.userId.name}</strong></p>
                        <p>{feedback.message}</p>
                        <p><small>Posted on {new Date(feedback.createdAt).toLocaleString()}</small></p>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .feedback-page {
                    padding: 2rem;
                    background-image: url('https://wallpapercave.com/wp/wp9473562.jpg');
                    background-size: cover;
                    background-position: center;
                    min-height: 100vh;
                    color: #1a1919;
                    backdrop-filter: brightness(0.7);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .title {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    text-align: center;
                    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
                }

                .feedback-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    max-width: 500px;
                    width: 100%;
                    margin-bottom: 2rem;
                    background: rgba(255, 255, 255, 0.7);
                    padding: 2rem;
                    border-radius: 10px;
                    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
                }

                textarea {
                    padding: 1rem;
                    font-size: 1rem;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    resize: vertical;
                    min-height: 150px;
                }

                button {
                    padding: 0.75rem;
                    font-size: 1rem;
                    border-radius: 8px;
                    border: none;
                    background-color: #4CAF50;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                button:disabled {
                    background-color: #ddd;
                    cursor: not-allowed;
                }

                button:hover:enabled {
                    background-color: #45a049;
                }

                .feedback-list {
                    margin-top: 2rem;
                    width: 100%;
                    max-width: 800px;
                    margin-bottom: 3rem;
                }

                .feedback-card {
                    background: rgba(255, 255, 255, 0.8);
                    padding: 1rem;
                    margin: 1rem 0;
                    border-radius: 10px;
                    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                    word-wrap: break-word;
                }

                .list-title {
                    text-align: center;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                }

                h1,h2{
                    color: #f3ebeb;
                }
            `}</style>
        </div>
    );
}
