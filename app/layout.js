'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast'; // ✅ Toast support
import 'leaflet/dist/leaflet.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const showNavbar = pathname !== '/' && pathname !== '/welcome';
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    router.push('/welcome');
  };

  return (
      <html lang="en">
      <body>
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Toast system */}
      {showNavbar && (
          <>
            {/* Top Header */}
            <div style={topHeaderStyle}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={hamburgerButtonStyle}>
                <div style={hamburgerLine}></div>
                <div style={hamburgerLine}></div>
                <div style={hamburgerLine}></div>
              </button>
              Welcome to PodLink
            </div>

            {/* Sidebar Navigation */}
            <div style={{ ...sidebarStyle, left: menuOpen ? '0' : '-12%' }}>
              <NavItem href="/home" label="Home" />
              <NavItem href="/search" label="Search" />
              <NavItem href="/history" label="History" />
              <NavItem href="/rewards" label="Rewards" />
              <NavItem href="/study-hall" label="Study Halls" />
              <NavItem href="/virtual-study-halls" label="Virtual Study Halls" />
              <NavItem href="/leadership" label="Leadership Board" />
              <NavItem href="/feedback" label="Feedback" />
              <hr style={dividerStyle} />
              <button onClick={handleLogout} style={logoutButtonStyle}>🔓 Logout</button>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div style={overlayStyle}>
                  <div style={modalStyle}>
                    <p>Do you really want to log out?</p>
                    <button onClick={confirmLogout} style={confirmButtonStyle}>Yes</button>
                    <button onClick={() => setShowLogoutConfirm(false)} style={cancelButtonStyle}>No</button>
                  </div>
                </div>
            )}
          </>
      )}
      <div>{children}</div>
      </body>
      </html>
  );
}

function NavItem({ href, label }) {
  return (
      <Link href={href} legacyBehavior>
        <a style={menuItemStyle}>{label}</a>
      </Link>
  );
}

// --- UI Styles ---
const topHeaderStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  background: 'rgba(255, 255, 255, 0.6)',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  fontFamily: 'Algerian, serif',
  color: 'black',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const hamburgerButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  position: 'absolute',
  left: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
};

const hamburgerLine = {
  width: '30px',
  height: '3px',
  background: 'black',
  margin: '6px 0',
};

const sidebarStyle = {
  position: 'fixed',
  top: 0,
  width: '10%',
  height: '100vh',
  background: 'black',
  color: 'white',
  paddingTop: '100px',
  transition: 'left 0.3s ease',
  zIndex: 999,
  boxShadow: '2px 0 10px rgba(0,0,0,0.5)',
  textAlign: 'center',
};

const menuItemStyle = {
  display: 'block',
  color: 'white',
  textDecoration: 'none',
  padding: '15px 0',
  fontSize: '1.2rem',
};

const logoutButtonStyle = {
  background: 'red',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  fontSize: '1rem',
  cursor: 'pointer',
  width: '80%',
  margin: '10px auto',
  display: 'block',
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1001,
};

const modalStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
};

const confirmButtonStyle = {
  background: 'green',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  fontSize: '1rem',
  cursor: 'pointer',
  margin: '10px',
};

const cancelButtonStyle = {
  background: 'gray',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  fontSize: '1rem',
  cursor: 'pointer',
  margin: '10px',
};

const dividerStyle = {
  margin: '10px 0',
  borderColor: 'gray',
};
