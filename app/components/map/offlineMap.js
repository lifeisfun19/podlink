import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix marker icons
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const OfflineMap = ({ users = [] }) => {
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => alert('Unable to fetch location'),
            { enableHighAccuracy: true }
        );
    }, []);

    if (!userLocation?.lat || !userLocation?.lng)
        return <p>Getting your location...</p>;

    return (
        <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; OpenStreetMap contributors'
            />

            <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>You are here</Popup>
            </Marker>

            {users.map((user) => (
                <Marker
                    key={user._id}
                    position={[
                        user.location.coordinates[1],
                        user.location.coordinates[0],
                    ]}
                >
                    <Popup>
                        <strong>{user.name}</strong>
                        <br />
                        {user.bio}
                        <br />
                        <button
                            className='mt-2 p-1 bg-blue-500 text-white rounded'
                            onClick={() => handleSendRequest(user._id)}
                        >
                            Send Request
                        </button>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

const handleSendRequest = async (receiverId) => {
    const res = await fetch('/api/match/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, type: 'offline' }),
    });
    const data = await res.json();
    alert(data.message || 'Request sent');
};

export default OfflineMap;
