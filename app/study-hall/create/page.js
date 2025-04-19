'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Firebase client SDK
import { getIdToken } from 'firebase/auth';

export default function CreateStudyHall() {
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [rsvpLimit, setRsvpLimit] = useState(50);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                setErrorMessage('You must be logged in to create a study hall.');
                return;
            }

            const token = await getIdToken(currentUser, true);

            const response = await fetch('/api/study-hall/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, topic, date, location, rsvp_limit: rsvpLimit }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Study Hall created successfully!');
                setTitle('');
                setTopic('');
                setDate('');
                setLocation('');
                setRsvpLimit(50);
                router.push('/study-hall');
            } else {
                setErrorMessage(data.message || 'Failed to create study hall.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('An unexpected error occurred.');
        }
    };

    return (
        <div className="create-study-hall-page">
            <style jsx>{`
                body, html {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', sans-serif;
                }

                .create-study-hall-page {
                    min-height: 100vh;
                    background-image: url('https://th.bing.com/th/id/OIP.THrTQ6LZTdiST130-SQTUgHaEo?rs=1&pid=ImgDetMain');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    padding: 4rem 2rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .form-container {
                    background: rgba(0, 0, 0, 0.7);
                    padding: 2rem 3rem;
                    border-radius: 10px;
                    width: 100%;
                    max-width: 600px;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
                    backdrop-filter: blur(5px);
                }

                h1 {
                    text-align: center;
                    font-size: 2.5rem;
                    margin-bottom: 2rem;
                    color: white;
                    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                label {
                    font-size: 1.1rem;
                    color: #f8f8f8;
                    margin-bottom: 0.5rem;
                }

                input {
                    padding: 0.8rem;
                    font-size: 1rem;
                    border: none;
                    border-radius: 8px;
                    outline: none;
                    background: rgba(255, 255, 255, 0.2);
                    color: #fff;
                    margin-bottom: 1rem;
                    width: 100%;
                }

                button {
                    padding: 1rem;
                    background-color: #48c78e;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    font-size: 1.1rem;
                    width: 100%;
                }

                button:hover {
                    background-color: #3ebd7d;
                }

                .message {
                    text-align: center;
                    font-size: 1.2rem;
                    margin-top: 1rem;
                }

                .success {
                    color: green;
                }

                .error {
                    color: red;
                }
            `}</style>

            <h1>Create a Study Hall</h1>
            {successMessage && <p className="message success">{successMessage}</p>}
            {errorMessage && <p className="message error">{errorMessage}</p>}

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label>Topic</label>
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} required />
                    </div>
                    <div>
                        <label>Date</label>
                        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div>
                        <label>Location</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </div>
                    <div>
                        <label>RSVP Limit</label>
                        <input type="number" value={rsvpLimit} onChange={(e) => setRsvpLimit(e.target.value)} required />
                    </div>
                    <button type="submit">Create Study Hall</button>
                </form>
            </div>
        </div>
    );
}
