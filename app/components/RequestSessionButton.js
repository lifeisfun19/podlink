// /components/RequestSessionButton.js
'use client';
import { useState } from 'react';

export default function RequestSessionButton({ to, course }) {
    const [link, setLink] = useState('');
    const [status, setStatus] = useState('');

    const meetLink = 'https://meet.google.com/hqt-xhht-rwm'; // <-- your actual meet link
    const time = new Date().toISOString(); // Can be made customizable

    const sendSessionRequest = async () => {
        try {
            const token = await window.firebase.auth().currentUser.getIdToken();
            const res = await fetch('/api/session/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ to, course, time, meetLink }),
            });

            const data = await res.json();
            if (data.success) {
                setStatus('Request sent! Use the link below to join the session:');
                setLink(data.session.meetLink);
            } else {
                setStatus('Failed to send request.');
            }
        } catch (err) {
            console.error(err);
            setStatus('Error sending session request.');
        }
    };

    return (
        <div>
            <button onClick={sendSessionRequest}>Request to Connect</button>
            {status && (
                <div>
                    <p>{status}</p>
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                </div>
            )}
        </div>
    );
}
