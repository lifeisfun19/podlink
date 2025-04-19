'use client';
import { useEffect, useState } from 'react';

export default function UpcomingSessions() {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/session/get');
                const data = await res.json();
                if (data.sessions) setSessions(data.sessions);
            } catch (err) {
                console.error('Failed to fetch sessions:', err);
            }
        })();
    }, []);


    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Upcoming Sessions</h2>
            {sessions.length === 0 && <p>No upcoming sessions</p>}
            <ul className="space-y-2">
                {sessions.map((s, i) => (
                    <li key={i} className="border p-3 rounded">
                        <div><strong>Course:</strong> {s.course}</div>
                        <div><strong>Time:</strong> {new Date(s.time).toLocaleString()}</div>
                        <div><strong>Link:</strong> <a className="text-blue-600 underline" href={s.meetLink} target="_blank">{s.meetLink}</a></div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
