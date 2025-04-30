"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Static seed sessions for frontend display only
    const seedHistory = [
      {
        partner: "Vivek Sagar Arora",
        date: "2025-04-06T10:00:00Z",
        mode: "online",
        location: "Online",
        link: "https://meet.google.com/abc-defg-hij",
      },
      {
        partner: "Zyan Munjal",
        date: "2025-03-06T10:00:00Z",
        mode: "online",
        location: "Online",
        link: "https://meet.google.com/abc-defg-hij",m
      },

    ];

    setHistory(seedHistory);
  }, []);

  return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <h1 style={titleStyle}>Your History</h1>
          <p style={subtitleStyle}>
            See your past study sessions and connections.
          </p>

          <div style={historyContainer}>
            {history.map((session, index) => (
                <HistoryCard
                    key={index}
                    title={`Study Session with ${session.partner}`}
                    date={new Date(session.date).toLocaleDateString()}
                    location={session.mode === "offline" ? session.location : "Online"}
                    link={session.link}
                />
            ))}
          </div>
        </div>
      </div>
  );
}

// History Card Component
function HistoryCard({ title, date, location, link }) {
  return (
      <div style={cardStyle}>
        <h3 style={cardTitle}>{title}</h3>
        <p style={cardDetail}>📅 {date}</p>
        <p style={cardDetail}>📍 {location}</p>
        {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              🔗 Join Link
            </a>
        )}
      </div>
  );
}

// Styles
const containerStyle = {
  height: "100vh",
  backgroundImage:
      "url('https://getwallpapers.com/wallpaper/full/5/1/3/891707-wallpaper-of-study-2518x1666-cell-phone.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  padding: "100px 50px",
  overflowY: "auto",
};

const contentStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  padding: "20px",
  borderRadius: "10px",
  maxWidth: "450px",
  width: "100%",
};

const titleStyle = {
  fontSize: "2.5rem",
  marginBottom: "10px",
};

const subtitleStyle = {
  fontSize: "1.2rem",
  marginBottom: "20px",
};

const historyContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "8px",
  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
};

const cardTitle = {
  fontSize: "1.4rem",
  marginBottom: "5px",
};

const cardDetail = {
  fontSize: "1rem",
  margin: "2px 0",
};

const linkStyle = {
  fontSize: "1rem",
  color: "#1a73e8",
  textDecoration: "underline",
  marginTop: "5px",
  display: "inline-block",
};
