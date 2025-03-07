"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const showNavbar = pathname !== "/" && pathname !== "/welcome"; // No navbar on Welcome Page
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true); // Show confirmation popup
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    router.push("/welcome"); // Redirect to Welcome Page
  };

  return (
    <html lang="en">
      <body>
        {showNavbar && (
          <>
            {/* Welcome Banner with Menu */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                background: "rgba(255, 255, 255, 0.6)", // Translucent white
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: "bold",
                fontFamily: "Algerian, serif",
                color: "black",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <div style={hamburgerLine}></div>
                <div style={hamburgerLine}></div>
                <div style={hamburgerLine}></div>
              </button>
              Welcome to PodLink
            </div>

            {/* Sidebar Menu */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: menuOpen ? "0" : "-12%",
                width: "10%",
                height: "100vh",
                background: "black",
                color: "white",
                paddingTop: "100px",
                transition: "left 0.3s ease",
                zIndex: 999,
                boxShadow: menuOpen ? "2px 0 10px rgba(0,0,0,0.5)" : "none",
                textAlign: "center",
              }}
            >
              <a href="/home" style={menuItemStyle}>Home</a>
              <a href="/search" style={menuItemStyle}>Search</a>
              <a href="/history" style={menuItemStyle}>History</a>
              <a href="/rewards" style={menuItemStyle}>Rewards</a>
              <hr style={{ margin: "10px 0", borderColor: "gray" }} />

              {/* Logout Button */}
              <button onClick={handleLogout} style={logoutButtonStyle}>
                🔓 Logout
              </button>
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

const hamburgerLine = {
  width: "30px",
  height: "3px",
  background: "black",
  margin: "6px 0",
};

const menuItemStyle = {
  display: "block",
  color: "white",
  textDecoration: "none",
  padding: "15px 0",
  fontSize: "1.2rem",
};

const logoutButtonStyle = {
  background: "red",
  color: "white",
  border: "none",
  padding: "10px 15px",
  fontSize: "1rem",
  cursor: "pointer",
  width: "80%",
  margin: "10px auto",
  display: "block",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1001,
};

const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
};

const confirmButtonStyle = {
  background: "green",
  color: "white",
  border: "none",
  padding: "10px 15px",
  fontSize: "1rem",
  cursor: "pointer",
  margin: "10px",
};

const cancelButtonStyle = {
  background: "gray",
  color: "white",
  border: "none",
  padding: "10px 15px",
  fontSize: "1rem",
  cursor: "pointer",
  margin: "10px",
};
