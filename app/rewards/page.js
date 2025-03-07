"use client";

export default function RewardsPage() {
  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Your Rewards</h1>
        <p style={subtitleStyle}>Start your learning journey and earn exciting badges!</p>

        {/* No Rewards Yet Section */}
        <div style={noRewardsStyle}>
          <p style={noRewardsText}>🏆 No rewards yet!</p>
          <p>Complete study sessions and participate in discussions to earn badges.</p>
        </div>

        {/* Rewards Preview (Locked Badges) */}
        <div style={badgesContainer}>
          <BadgeCard title="Beginner Learner" status="🔒 Locked" />
          <BadgeCard title="Study Streak" status="🔒 Locked" />
          <BadgeCard title="Collaboration Star" status="🔒 Locked" />
        </div>
      </div>
    </div>
  );
}

// Badge Component
function BadgeCard({ title, status }) {
  return (
    <div style={badgeStyle}>
      <h3 style={badgeTitle}>{title}</h3>
      <p style={badgeStatus}>{status}</p>
    </div>
  );
}

// Styles
const containerStyle = {
  height: "100vh",
  backgroundImage:
    "url('https://getwallpapers.com/wallpaper/full/0/0/5/891606-widescreen-wallpaper-of-study-1920x1200-for-4k.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "flex-start", // Moves content lower
  justifyContent: "flex-start", // Aligns content to the left
  padding: "100px 50px",
};

const contentStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.85)", // Light background for readability
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

const noRewardsStyle = {
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
};

const noRewardsText = {
  fontSize: "1.2rem",
  fontWeight: "bold",
};

const badgesContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const badgeStyle = {
  backgroundColor: "#ddd",
  padding: "10px",
  borderRadius: "8px",
  textAlign: "center",
};

const badgeTitle = {
  fontSize: "1.3rem",
  marginBottom: "5px",
};

const badgeStatus = {
  fontSize: "1rem",
  color: "gray",
};
