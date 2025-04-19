"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './profile.css';
import { auth } from '@/lib/firebase';

export default function CourseEditor() {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const token = await user.getIdToken();
                const res = await fetch('/api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Unable to fetch courses');
                } else {
                    setCourses(data.courses || []);
                }
            } catch (err) {
                setError('Something went wrong.');
                console.error('Profile fetch error:', err);
            }
        };
        void fetchCourses();
    }, []);

    const addCourse = () => {
        const trimmedCourse = newCourse.trim();
        if (!trimmedCourse) {
            setError('Course name cannot be empty.');
            return;
        }
        if (courses.includes(trimmedCourse)) {
            setError('This course is already in your list.');
            return;
        }

        setCourses([...courses, trimmedCourse]);
        setNewCourse('');
        setError('');
    };

    const removeCourse = (course) => {
        setCourses(courses.filter(c => c !== course));
    };

    const saveCourses = async () => {
        if (saving) return; // Prevent multiple submissions

        setSaving(true);
        try {
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            const res = await fetch('/api/user/courses/update-courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ courses }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Failed to update courses.');
            } else {
                alert('Courses updated successfully!');
                router.push('/home');
            }
        } catch (err) {
            alert('Error saving courses.');
            console.error('Save courses error:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="form-section">
            <h2>Your Courses</h2>
            {error && <p className="error">{error}</p>}
            <div className="course-input-row">
                <input
                    type="text"
                    value={newCourse}
                    onChange={e => setNewCourse(e.target.value)}
                    placeholder="Add a course (e.g. CS101)"
                />
                <button onClick={addCourse} disabled={saving}>Add</button>
            </div>
            <div className="course-tags">
                {courses.map(course => (
                    <div key={course} className="course-tag">
                        {course}
                        <span onClick={() => removeCourse(course)}>×</span>
                    </div>
                ))}
            </div>
            <button onClick={saveCourses} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
}
