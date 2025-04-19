"use client";

import { useState, useEffect } from "react";
import { getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase.js";

export default function AccountModal({ user, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        location: "",
        avatar: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                bio: user.bio || "",
                location: user.location || "",
                avatar: user.avatar || null, // assuming you have avatar data in user
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                avatar: file,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const firebaseUser = auth.currentUser;
            const token = await getIdToken(firebaseUser, true);

            // Prepare form data for submission
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("bio", formData.bio);
            formDataToSend.append("location", formData.location);

            // Append avatar if available
            if (formData.avatar) {
                formDataToSend.append("avatar", formData.avatar);
            }

            // Save profile data to the server (MongoDB)
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            if (!res.ok) throw new Error("Failed to update profile");

            setSuccess(true);
            alert("Profile updated successfully!");
            onClose(); // Close modal after successful update
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn">
                    X
                </button>
                <h2>Edit Profile</h2>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">Profile updated successfully!</p>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label>Bio:</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself"
                        />
                    </div>

                    <div>
                        <label>Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter your location"
                        />
                    </div>

                    <div>
                        <label>Avatar (optional):</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
