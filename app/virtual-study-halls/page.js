'use client';

import { useEffect, useState } from 'react';

export default function VirtualStudyHallsPage() {
    const [halls, setHalls] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStudyHalls() {
            try {
                const response = await fetch('/api/virtual-study-halls');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (!Array.isArray(data.halls)) {
                    throw new Error("Unexpected response format: 'halls' is not an array");
                }
                setHalls(data.halls);
            } catch (err) {
                console.error('Error fetching virtual study halls:', err);
                setError('Failed to load study halls.');
            }
        }

        void fetchStudyHalls();
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Virtual Study Halls</h1>
            {error ? (
                <p style={{ color: '#fff', background: 'rgba(255,0,0,0.6)', padding: '10px 20px', borderRadius: '8px' }}>
                    {error}
                </p>
            ) : halls.length === 0 ? (
                <p style={{ color: '#fff', fontStyle: 'italic' }}>No study halls available right now.</p>
            ) : (
                <div style={styles.hallsGrid}>
                    {halls.map((hall) => (
                        <div key={hall._id} style={styles.card}>
                            <h2>{hall.title}</h2>
                            <a
                                href={hall.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.joinButton}
                            >
                                Join Now
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '40px',
        minHeight: '100vh',
        backgroundImage: 'url("https://i.pinimg.com/736x/4b/0d/a1/4b0da19b9a40801d1009fd4e355f11cd.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#ffffff',
        textShadow: '2px 2px 6px #000',
    },
    hallsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '1000px',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
    joinButton: {
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#4285f4',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    },
};
