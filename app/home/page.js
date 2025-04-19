"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { getIdToken } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (!firebaseUser) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            try {
                const token = await getIdToken(firebaseUser, true);

                const resMatches = await fetch("/api/match", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!resMatches.ok) throw new Error("Failed to fetch matches");
                const matchedUsers = await resMatches.json();
                setMatches(matchedUsers);

                const resProfile = await fetch("/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (resProfile.ok) {
                    const profileData = await resProfile.json();
                    setUser(profileData);
                }

            } catch (err) {
                console.error("Error:", err);
                setError(err.message || "Unexpected error");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                background:
                    "url('https://getwallpapers.com/wallpaper/full/1/6/f/891597-best-wallpaper-of-study-2560x1600-notebook.jpg') center/cover no-repeat",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                overflowY: "auto"
            }}
        >
            <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "white" }}>
                Explore study pods and collaborate with students!
            </h1>

            {loading && <p style={{ color: "white" }}>Loading your data...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "20px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    padding: "10px",
                    cursor: "pointer",
                    width: "60px",
                    height: "60px",
                }}
            >
                <Link href="/profile">
                    <Image
                        src={user?.avatar || "/images/default-avatar.png"} // ✅ Updated path
                        alt="User Avatar"
                        width={60}
                        height={60}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                </Link>
            </div>

            {/* ✅ Matched Users */}
            <div
                style={{
                    marginTop: "20px",
                    padding: "20px",
                    background: "rgba(255, 255, 255, 0.85)",
                    borderRadius: "10px",
                    width: "60%",
                    textAlign: "center",
                }}
            >
                <h2>Matched Students</h2>
                {matches.length > 0 ? (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {matches.map((match, index) => {
                            const coords = match?.location?.coordinates;
                            const locationString = coords
                                ? `${coords[1]}, ${coords[0]}`
                                : "N/A";

                            return (
                                <li key={index} style={{ marginBottom: "15px" }}>
                                    👤 {match.name || "Unknown"} | 📍 {locationString} | 📚 {match.courses?.[0] || "No course"}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No matches available at the moment.</p>
                )}
            </div>

            {/* ✅ Badges and Points */}
            {user && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "10px",
                        width: "60%",
                        textAlign: "left"
                    }}
                >
                    <h3>🎖️ Badges</h3>
                    <ul>
                        {user.badges?.length > 0 ? (
                            user.badges.map((badge, index) => (
                                <li key={index}>{badge}</li>
                            ))
                        ) : (
                            <li>No badges yet</li>
                        )}
                    </ul>
                    <p><strong>Points:</strong> {user.points || 0}</p>
                </div>
            )}
        </div>
    );
}
