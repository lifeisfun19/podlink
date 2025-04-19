'use client';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import '@/lib/firebase'; // Ensure Firebase is initialized

export default function StudyHalls() {
    const [studyHalls, setStudyHalls] = useState([]);
    const [userId, setUserId] = useState(null);
    const router = useRouter(); // Initialize the router

    useEffect(() => {
        const fetchUserId = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                try {
                    const token = await user.getIdToken();
                    const res = await fetch(`/api/user/by-firebase-id?firebaseUid=${user.uid}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!res.ok) throw new Error('User lookup failed');
                    const data = await res.json();
                    setUserId(data._id);
                } catch (err) {
                    console.error('Error fetching user ID:', err);
                }
            }
        };

        const fetchStudyHalls = async () => {
            try {
                const response = await fetch('/api/study-hall/all');
                const data = await response.json();
                setStudyHalls(data);
            } catch (err) {
                console.error('Error loading study halls:', err);
            }
        };

        void fetchUserId();
        void fetchStudyHalls();
    }, []);

    const handleRsvp = async (studyHallId) => {
        if (!userId) {
            alert('User not loaded yet');
            return;
        }

        try {
            const response = await fetch('/api/study-hall/rsvp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studyHallId, userId }),
            });

            if (response.ok) {
                alert('RSVP successful');
            } else {
                alert('Failed to RSVP');
            }
        } catch (err) {
            console.error('Error during RSVP:', err);
            alert('Something went wrong while RSVPing.');
        }
    };

    // Function to redirect to the create study hall page
    const handleCreateStudyHall = () => {
        router.push('/study-hall/create');
    };

    return (
        <div className="study-hall-page">
            <style jsx>{`
                body, html {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', sans-serif;
                }

                .study-hall-page {
                    min-height: 100vh;
                    background-image: url('https://wallpapers.com/images/hd/study-background-csdn2xd7eo43wtho.jpg');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    backdrop-filter: blur(5px);
                    padding: 4rem 2rem;
                    color: #ffffff;
                    position: relative;
                }

                .title {
                    text-align: center;
                    font-size: 2.8rem;
                    margin-bottom: 2rem;
                    text-shadow: 1px 1px 4px #000;
                }

                .button-container {
                    position: absolute;
                    top: 1rem;
                    right: 2rem;
                    z-index: 100;
                }

                .create-btn {
                    padding: 0.8rem 1.5rem;
                    background-color: #48c78e;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: background 0.3s ease;
                }

                .create-btn:hover {
                    background-color: #3ebd7d;
                }

                .hall-list {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 2rem;
                }

                .hall-card {
                    background: rgba(0, 0, 0, 0.55);
                    border-radius: 16px;
                    padding: 1.5rem 2rem;
                    width: 320px;
                    color: #fff;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
                    backdrop-filter: blur(4px);
                    transition: transform 0.2s ease-in-out;
                }

                .hall-card:hover {
                    transform: scale(1.03);
                }

                .hall-card h2 {
                    margin-top: 0;
                    font-size: 1.5rem;
                    border-bottom: 1px solid #ffffff33;
                    padding-bottom: 0.5rem;
                }

                .hall-card p {
                    margin: 0.5rem 0;
                    font-size: 0.95rem;
                }

                .hall-card button {
                    margin-top: 1rem;
                    padding: 0.6rem 1.2rem;
                    background-color: #48c78e;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .hall-card button:hover {
                    background-color: #3ebd7d;
                }

                .no-halls {
                    text-align: center;
                    font-size: 1.2rem;
                    color: #f8f8f8;
                }
            `}</style>

            <h1 className="title">📚 Upcoming Study Halls</h1>

            {/* Create Study Hall Button positioned at the top right */}
            <div className="button-container">
                <button className="create-btn" onClick={handleCreateStudyHall}>Create Study Hall</button>
            </div>

            {studyHalls.length === 0 ? (
                <p className="no-halls">No study halls available</p>
            ) : (
                <div className="hall-list">
                    {studyHalls.map((studyHall) => (
                        <div key={studyHall._id} className="hall-card">
                            <h2>{studyHall.title}</h2>
                            <p><strong>Topic:</strong> {studyHall.topic}</p>
                            <p><strong>Host:</strong> {studyHall.hostId?.name || 'Unknown'}</p>
                            <p><strong>Date:</strong> {new Date(studyHall.date).toLocaleString()}</p>
                            <p><strong>Location:</strong> {studyHall.location}</p>
                            <p><strong>Participants:</strong> {studyHall.participants?.length || 0}</p>
                            <button onClick={() => handleRsvp(studyHall._id)}>RSVP</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
