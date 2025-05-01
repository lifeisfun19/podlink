'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { auth } from '@/lib/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

const Map = dynamic(() => import('@/components/map/offlineMap.js'), { ssr: false });

export default function SearchPage() {
    const [activeTab, setActiveTab] = useState('online');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [requestedUserIds, setRequestedUserIds] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const token = await firebaseUser.getIdToken();
                    const location = { type: 'Point', coordinates: [0, 0] };

                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            location.coordinates = [
                                position.coords.longitude,
                                position.coords.latitude,
                            ];
                            await syncUser(firebaseUser, token, location);
                        },
                        async () => {
                            await syncUser(firebaseUser, token, location);
                        }
                    );

                    const res = await fetch('/api/request/respond', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await res.json();
                    if (res.ok) {
                        setIncomingRequests(data || []);
                    }
                } catch (err) {
                    console.error('❌ Failed to sync user:', err.message);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const syncUser = async (firebaseUser, token, location) => {
        const payload = {
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || '',
            location: location || { type: 'Point', coordinates: [0, 0] },
            interests: [],
            courses: [],
            bio: '',
        };

        await fetch('/api/user/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
    };

    const handleSearch = async () => {
        if (activeTab === 'offline') {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const res = await fetch('/api/nearby-users', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            }),
                        });

                        const data = await res.json();
                        setSearchResults(data);
                    } catch {
                        toast.error('📡 Failed to fetch nearby users.');
                        setSearchResults([]);
                    }
                },
                () => {
                    toast.warn('📍 Location access denied. Enable it for offline search.');
                }
            );
        } else {
            if (!searchQuery.trim()) return;
            try {
                const res = await fetch(
                    `/api/match/online-matching?query=${encodeURIComponent(searchQuery)}`
                );
                const data = await res.json();
                setSearchResults(data);
            } catch {
                toast.error('❌ Failed to fetch online search results.');
                setSearchResults([]);
            }
        }
    };

    const handleRequest = async (user) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                toast.error("⚠️ You're not logged in.");
                return;
            }

            if (requestedUserIds.includes(user._id)) {
                toast.info('⚠️ Request already sent to this user.');
                return;
            }

            setRequestedUserIds((prev) => [...prev, user._id + '_pending']);

            const token = await currentUser.getIdToken();

            const res = await fetch('/api/request/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ receiverId: user._id }),
            });

            const data = await res.json();

            setRequestedUserIds((prev) =>
                prev.filter((id) => id !== user._id + '_pending')
            );

            if (res.ok) {
                toast.success('✅ Request sent successfully.');
                setRequestedUserIds((prev) => [...prev, user._id]);
            } else {
                toast.error(`❌ ${data.error || 'Failed to send request.'}`);
            }
        } catch {
            setRequestedUserIds((prev) =>
                prev.filter((id) => !id.endsWith('_pending'))
            );
            toast.error('⚠️ Server error. Please try again.');
        }
    };

    const handleResponse = async (requestId, response) => {
        try {
            const res = await fetch('/api/request/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, response }),
            });

            const data = await res.json();
            if (res.ok) {
                if (response === 'accept' && data.meetLink) {
                    toast.success('✅ Request accepted! Redirecting to Google Meet...');
                    window.location.href = data.meetLink;
                } else if (response === 'reject') {
                    toast.success('❌ Request rejected.');
                }
            } else {
                toast.error('❌ Could not process response.');
            }
        } catch {
            toast.error('⚠️ Response failed.');
        }
    };

    return (
        <div
            style={{
                height: '100dvh',
                backgroundImage:
                    "url('https://www.theshepherd.org/GetImage.ashx?Guid=dae0f137-6c5d-43c4-97ee-502e49e6f1e7&w=960&mode=max')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '30px',
                    borderRadius: '15px',
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
                    width: '400px',
                    textAlign: 'center',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    overflowY: 'auto',
                    maxHeight: '95vh',
                }}
            >
                <h1 style={{ fontSize: '2rem', marginBottom: '15px', color: '#fff' }}>
                    Find Study Buddies
                </h1>

                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    {['online', 'offline'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                background:
                                    activeTab === tab
                                        ? (tab === 'online' ? '#00c6ff' : '#ff758c')
                                        : 'rgba(255,255,255,0.3)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                            }}
                        >
                            {tab === 'online' ? '💻 Online' : '📍 Offline'}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    placeholder={activeTab === 'online' ? 'Enter course name...' : 'Enter city or area...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={activeTab === 'offline'}
                    style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        background: 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        outline: 'none',
                        textAlign: 'center',
                    }}
                />

                <button
                    onClick={handleSearch}
                    style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '1rem',
                        background: '#06beb6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                    }}
                >
                    🔍 Search
                </button>

                <div style={{ color: '#fff', textAlign: 'left' }}>
                    {searchResults.length > 0 ? (
                        <ul>
                            {searchResults.map((user, index) => (
                                <li key={index} style={{ marginBottom: '15px' }}>
                                    👤 {user.name || 'Unnamed User'}
                                    {requestedUserIds.includes(user._id) ? (
                                        <div
                                            style={{
                                                marginTop: '10px',
                                                backgroundColor: '#d1e7dd',
                                                padding: '10px',
                                                borderRadius: '10px',
                                                color: '#0f5132',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            ✅ Request Sent!
                                        </div>
                                    ) : requestedUserIds.includes(user._id + '_pending') ? (
                                        <button
                                            disabled
                                            style={{
                                                background: '#6c757d',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                marginLeft: '10px',
                                                cursor: 'not-allowed',
                                            }}
                                        >
                                            ⏳ Sending...
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleRequest(user)}
                                            style={{
                                                background: '#007bff',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                marginLeft: '10px',
                                            }}
                                        >
                                            Request to Connect
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ marginTop: '10px' }}>🔍 No results found.</p>
                    )}
                </div>

                {activeTab === 'offline' && (
                    <div
                        style={{
                            marginTop: '20px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            height: '250px',
                        }}
                    >
                        <Map searchQuery={searchQuery} />
                    </div>
                )}

                {incomingRequests.length > 0 && (
                    <div style={{ marginTop: '25px', color: '#fff' }}>
                        <h3>Incoming Requests</h3>
                        <ul>
                            {incomingRequests.map((req) => (
                                <li key={req._id} style={{ marginBottom: '10px' }}>
                                    📩 {req.fromUser?.name || 'Anonymous'} wants to study with you.
                                    <button
                                        onClick={() => handleResponse(req._id, 'accept')}
                                        style={{
                                            background: '#28a745',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            marginLeft: '10px',
                                        }}
                                    >
                                        Accept & Join Meet
                                    </button>
                                    <button
                                        onClick={() => handleResponse(req._id, 'reject')}
                                        style={{
                                            background: '#dc3545',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            marginLeft: '10px',
                                        }}
                                    >
                                        Reject
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
