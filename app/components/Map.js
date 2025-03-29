"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultPosition = [28.7041, 77.1025]; // Default to Delhi if location access is denied

const userIcon = new L.Icon({
  iconUrl: "/user-marker.png",
  iconSize: [32, 32],
});

const studySpotIcon = new L.Icon({
  iconUrl: "/study-spot-marker.png",
  iconSize: [32, 32],
});

export default function MapComponent() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [studySpots, setStudySpots] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userCoords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userCoords);

          // Fetch study spots
          const spots = await getStudySpots(userCoords[0], userCoords[1]);
          setStudySpots(spots);
        },
        (error) => {
          console.warn("Location access denied. Using default.", error);
          setUserLocation(defaultPosition);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetch(`/api/nearby-users?lat=${userLocation[0]}&lng=${userLocation[1]}`)
        .then((res) => res.json())
        .then((data) => setNearbyUsers(data))
        .catch((err) => console.error("Error fetching users:", err));
    }
  }, [userLocation]);

  return (
    <MapContainer center={userLocation || defaultPosition} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* User's Location */}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>You are here 📍</Popup>
        </Marker>
      )}

      {/* Nearby Users */}
      {nearbyUsers.map((user, index) => (
        <Marker key={index} position={[user.lat, user.lng]} icon={userIcon}>
          <Popup>
            {user.name} is studying {user.course}
            <br />
            <button onClick={() => sendConnectionRequest(user.id)}>Connect</button>
            <br />
            <button onClick={() => startOnlineSession(user.id)}>Start Google Meet/Zoom</button>
          </Popup>
        </Marker>
      ))}

      {/* Nearby Study Spots */}
      {studySpots.map((spot, index) => (
        <Marker key={index} position={[spot.lat, spot.lng]} icon={studySpotIcon}>
          <Popup>{spot.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

const getStudySpots = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=library,cafe&lat=${lat}&lon=${lng}&radius=5000`
    );
    const data = await res.json();

    return data.map((spot) => ({
      name: spot.display_name,
      lat: parseFloat(spot.lat),
      lng: parseFloat(spot.lon),
    }));
  } catch (error) {
    console.error("Error fetching study spots:", error);
    return [];
  }
};

// Function to send connection requests
function sendConnectionRequest(userId) {
  fetch(`/api/send-request`, {
    method: "POST",
    body: JSON.stringify({ toUser: userId }),
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    if (res.ok) alert("Request sent!");
  });
}

// Function to start an online study session
function startOnlineSession(userId) {
  // Open a Google Meet or Zoom session link (placeholder links)
  const meetLink = `https://meet.google.com/new`;
  const zoomLink = `https://zoom.us/start`;
  window.open(meetLink, "_blank"); // Opens Google Meet
  // Alternatively, you can use zoomLink for Zoom
}
