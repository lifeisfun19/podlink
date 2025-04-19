"use client";
import { useState, useEffect } from "react";

export default function PreferencesForm({ uid }) {
    const [form, setForm] = useState({
        interests: [],
        location: "",
        mode: "Online",
        availability: "",
        courses: [],
    });

    const [status, setStatus] = useState("");

    // ✅ Fetch preferences and courses inside an async IIFE to avoid ESLint warnings
    useEffect(() => {
        if (!uid) return;

        (async () => {
            try {
                const [prefRes, courseRes] = await Promise.all([
                    fetch(`/api/user/preferences?uid=${uid}`),
                    fetch(`/api/user/courses?uid=${uid}`),
                ]);

                const prefs = await prefRes.json();
                const courses = await courseRes.json();

                setForm((prev) => ({
                    ...prev,
                    ...prefs,
                    courses: Array.isArray(courses) ? courses : [],
                }));
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        })();
    }, [uid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (field, index, value) => {
        const copy = [...form[field]];
        copy[index] = value;
        setForm((prev) => ({ ...prev, [field]: copy }));
    };

    const addField = (field) => {
        setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Saving...");

        try {
            const [prefRes, courseRes] = await Promise.all([
                fetch("/api/user/preferences", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid, ...form }),
                }),
                fetch("/api/user/courses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid, courses: form.courses }),
                }),
            ]);

            if (prefRes.ok && courseRes.ok) {
                setStatus("✅ Saved successfully.");
            } else {
                setStatus("❌ Failed to save.");
            }
        } catch (error) {
            console.error("Save error:", error);
            setStatus("❌ Error while saving.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold">Your Preferences</h2>

            <div>
                <label className="block font-medium">Location</label>
                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Mode</label>
                <select
                    name="mode"
                    value={form.mode}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                </select>
            </div>

            <div>
                <label className="block font-medium">Availability</label>
                <input
                    type="text"
                    name="availability"
                    placeholder="e.g., Weekdays 5-7pm"
                    value={form.availability}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Interests</label>
                {form.interests.map((val, i) => (
                    <input
                        key={i}
                        type="text"
                        value={val}
                        onChange={(e) => handleArrayChange("interests", i, e.target.value)}
                        className="w-full border px-2 py-1 rounded my-1"
                    />
                ))}
                <button type="button" onClick={() => addField("interests")} className="text-blue-600 mt-1">
                    + Add Interest
                </button>
            </div>

            <div>
                <label className="block font-medium">Courses</label>
                {form.courses.map((val, i) => (
                    <input
                        key={i}
                        type="text"
                        value={val}
                        onChange={(e) => handleArrayChange("courses", i, e.target.value)}
                        className="w-full border px-2 py-1 rounded my-1"
                    />
                ))}
                <button type="button" onClick={() => addField("courses")} className="text-blue-600 mt-1">
                    + Add Course
                </button>
            </div>

            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Save Preferences
            </button>

            {status && <p className="text-sm mt-2">{status}</p>}
        </form>
    );
}
