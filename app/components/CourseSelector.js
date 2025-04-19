'use client';
import { useState, useEffect } from 'react';

export default function CourseSelector() {
    const [courses, setCourses] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/profile').then(res => res.json()).then(data => {
            setCourses(data?.courses?.join(', ') || '');
        });
    }, []);

    const saveCourses = async () => {
        const res = await fetch('/api/courses', {
            method: 'POST',
            body: JSON.stringify({ courses }),
        });
        const data = await res.json();
        setMessage(data.message);
    };

    return (
        <div className="p-4">
            <textarea value={courses} onChange={e => setCourses(e.target.value)} className="border w-full p-2" />
            <button onClick={saveCourses} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">Save Courses</button>
            {message && <p>{message}</p>}
        </div>
    );
}
