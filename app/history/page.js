"use client";

export default function HistoryPage() {
  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Your History</h1>
        <p style={subtitleStyle}>See your past study sessions and connections.</p>

        {/* Sample History Entries */}
        <div style={historyContainer}>
          <HistoryCard
            title="Group Study - AI Basics"
            date="March 5, 2025"
            location="Library Room 302"
          />
          <HistoryCard
            title="Math Revision Meetup"
            date="February 28, 2025"
            location="Café Study Spot"
          />
          <HistoryCard
            title="Project Collaboration - PodLink"
            date="February 20, 2025"
            location="Online Session"
          />
        </div>
      </div>
    </div>
  );
}

// History Card Component
function HistoryCard({ title, date, location }) {
  return (
    <div style={cardStyle}>
      <h3 style={cardTitle}>{title}</h3>
      <p style={cardDetail}>📅 {date}</p>
      <p style={cardDetail}>📍 {location}</p>
    </div>
  );
}

// Styles
const containerStyle = {
  height: "100vh",
  backgroundImage: "url('https://getwallpapers.com/wallpaper/full/5/1/3/891707-wallpaper-of-study-2518x1666-cell-phone.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "flex-start", // Moves content lower
  justifyContent: "flex-start", // Aligns content to the left
  padding: "100px 50px", // Space from top and left
};

const contentStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.8)", // Light background for contrast
  padding: "20px",
  borderRadius: "10px",
  maxWidth: "400px",
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
