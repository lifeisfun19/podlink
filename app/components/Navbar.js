"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav
      style={{
        backgroundColor: "#2c3e50",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "white", fontSize: "1.5rem" }}>PodLink</h1>

      <div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              right: "20px",
              top: "50px",
              backgroundColor: "white",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <button onClick={() => router.push("/home")}>Home</button>
              </li>
              <li>
                <button onClick={() => router.push("/history")}>
                  Your History
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/rewards")}>
                  Your Rewards
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
