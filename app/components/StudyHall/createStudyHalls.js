'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

const CreateStudyHall = () => {
    const auth = getAuth(app);
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const [rsvpLimit, setRsvpLimit] = useState(50);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Get current location on load
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = auth.currentUser;
            if (!user) {
                setErrorMessage("You must be logged in");
                return;
            }

            const idToken = await user.getIdToken();

            const response = await fetch('/api/study-hall/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    title,
                    topic,
                    date,
                    location,
                    coordinates,
                    rsvp_limit: rsvpLimit,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Study Hall created successfully!');
                router.push('/study-hall');
            } else {
                setErrorMessage(data.message || 'Failed to create Study Hall');
            }
        } catch (err) {
            setErrorMessage('Something went wrong: ' + err.message);
        }
    };

    return (
        <div className="create-studyhall-container">
            <h2>Create a Study Hall</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <input type="text" placeholder="Topic" value={topic} onChange={e => setTopic(e.target.value)} required />
                <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
                <input type="text" placeholder="Location (e.g. Library, Room 301)" value={location} onChange={e => setLocation(e.target.value)} required />
                <input type="number" placeholder="RSVP Limit" value={rsvpLimit} onChange={e => setRsvpLimit(e.target.value)} min="1" max="100" />
                <button type="submit">Create</button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default CreateStudyHall;
