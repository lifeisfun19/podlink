'use client';
import { useEffect, useState } from 'react';
import { getBadgeMeta } from '@/lib/utils/badge';
import Image from 'next/image';
import { auth } from '@/lib/firebase';

export default function RewardsPage() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          console.error("No Firebase token available.");
          return;
        }

        const res = await fetch('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch profile:', await res.text());
          return;
        }

        const data = await res.json();
        setBadges(data.badges || []);
      } catch (error) {
        console.error('Failed to fetch badges:', error);
      }
    };
    void fetchBadges();
  }, []);

  return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <h1 style={titleStyle}>🎖️ Your Rewards</h1>
          <p style={subtitleStyle}>Start learning and unlock awesome badges!</p>

          {badges.length === 0 ? (
              <div style={noRewardsStyle}>
                <p style={noRewardsText}>🏆 No rewards yet!</p>
                <p>Complete sessions and participate to earn badges.</p>
              </div>
          ) : (
              <div style={badgesGrid}>
                {badges.map((badgeId) => {
                  const badge = getBadgeMeta(badgeId);
                  return badge ? (
                      <div key={badge.name} style={badgeCardStyle}>
                        <Image
                            src={badge.icon}
                            alt={badge.name}
                            width={80}
                            height={80}
                            style={badgeImage}
                        />
                        <h3 style={badgeTitle}>{badge.name}</h3>
                        <p style={badgeStatus}>{badge.description}</p>
                      </div>
                  ) : null;
                })}
              </div>
          )}

          <div style={lockedContainer}>
            <h2 style={lockedTitle}>🔒 Locked Badges</h2>
            <BadgeCard title="First Match" status="Locked - Complete your first session!" />
            <BadgeCard title="Map Explorer" status="Locked - Match 3 days in a row" />
            <BadgeCard title="Collaboration Star" status="Locked - Join 5+ sessions" />
          </div>
        </div>
      </div>
  );
}

// Locked Badge Component
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
  minHeight: '100vh',
  backgroundImage: "url('https://getwallpapers.com/wallpaper/full/0/0/5/891606-widescreen-wallpaper-of-study-1920x1200-for-4k.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  padding: '80px 20px',
};

const contentStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '30px',
  borderRadius: '12px',
  maxWidth: '700px',
  width: '100%',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
};

const titleStyle = {
  fontSize: '2.2rem',
  marginBottom: '10px',
  fontWeight: 'bold',
};

const subtitleStyle = {
  fontSize: '1.1rem',
  marginBottom: '25px',
  color: '#333',
};

const noRewardsStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
};

const noRewardsText = {
  fontSize: '1.3rem',
  fontWeight: 'bold',
};

const badgesGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '20px',
  marginBottom: '30px',
};

const badgeCardStyle = {
  backgroundColor: '#f8f8f8',
  padding: '15px',
  borderRadius: '10px',
  textAlign: 'center',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

const badgeImage = {
  marginBottom: '10px',
};

const badgeTitle = {
  fontSize: '1rem',
  fontWeight: 'bold',
};

const badgeStatus = {
  fontSize: '0.85rem',
  color: '#666',
};

const badgeStyle = {
  backgroundColor: '#e0e0e0',
  padding: '12px',
  borderRadius: '8px',
  textAlign: 'center',
  marginBottom: '12px',
};

const lockedContainer = {
  backgroundColor: '#f4f4f4',
  padding: '20px',
  borderRadius: '10px',
  marginTop: '20px',
};

const lockedTitle = {
  fontSize: '1.2rem',
  marginBottom: '10px',
};
