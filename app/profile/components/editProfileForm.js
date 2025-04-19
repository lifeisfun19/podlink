"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './profile.css';
import { auth } from '@/lib/firebase.js';

export default function EditProfileForm({ initialData = null, onSaved = () => {} }) {
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        location: '',
        interests: '',
        avatar: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                if (initialData) {
                    setFormData(initialData);
                    setAvatarPreview(initialData.avatar || null);
                    return;
                }

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
                setFormData({
                    name: data.name || '',
                    bio: data.bio || '',
                    location: data.location || '',
                    interests: data.interests?.join(', ') || '',
                    avatar: ''
                });
                setAvatarPreview(data.avatar || null);
            } catch (error) {
                setError('Error fetching profile data.');
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        void fetchProfile();
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.name || !formData.location) {
            setError('Name and location are required.');
            setLoading(false);
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            const formPayload = new FormData();

            formPayload.append('name', formData.name);
            formPayload.append('bio', formData.bio);
            formPayload.append('location', formData.location);
            formPayload.append('interests', formData.interests);

            if (formData.avatar && formData.avatar instanceof File) {
                formPayload.append('avatar', formData.avatar);
            }

            const res = await fetch('/api/user/profile/update', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formPayload,
            });

            if (res.ok) {
                alert('✅ Profile updated successfully!');
                onSaved();
            } else {
                const errorData = await res.json();
                setError(`❌ Failed: ${errorData.message || 'Could not update profile.'}`);
            }
        } catch (err) {
            console.error('Profile update error:', err);
            setError('❌ An error occurred while updating the profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-section">
            <h2>Edit Profile</h2>
            {error && <p className="error">{error}</p>}

            {['name', 'bio', 'location', 'interests'].map((field) => (
                <div key={field} className="form-group">
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    {field === 'bio' ? (
                        <textarea
                            name="bio"
                            rows="3"
                            value={formData.bio || ''}
                            onChange={handleChange}
                        />
                    ) : (
                        <input
                            type="text"
                            name={field}
                            value={formData[field] || ''}
                            onChange={handleChange}
                        />
                    )}
                </div>
            ))}

            <div className="form-group">
                <label>Avatar</label>
                <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                />
                {avatarPreview && (
                    <div style={{ marginTop: '10px' }}>
                        <Image
                            src={avatarPreview}
                            alt="Avatar Preview"
                            width={80}
                            height={80}
                            style={{ objectFit: 'cover', borderRadius: '50%' }}
                        />
                    </div>
                )}
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
            </button>
        </form>
    );
}
