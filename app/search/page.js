"use client";
import { useState } from "react";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("online");

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage:
          "url('https://www.theshepherd.org/GetImage.ashx?Guid=dae0f137-6c5d-43c4-97ee-502e49e6f1e7&w=960&mode=max')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
          width: "400px",
          textAlign: "center",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "15px", color: "#fff" }}>
          Find Study Buddies
        </h1>

        {/* Tab Selection */}
        <div
          style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}
        >
          <button
            onClick={() => setActiveTab("online")}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "1rem",
              cursor: "pointer",
              background: activeTab === "online" ? "#00c6ff" : "rgba(255,255,255,0.3)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              transition: "0.3s",
              fontWeight: "bold",
            }}
          >
            💻 Online
          </button>
          <button
            onClick={() => setActiveTab("offline")}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "1rem",
              cursor: "pointer",
              background: activeTab === "offline" ? "#ff758c" : "rgba(255,255,255,0.3)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              transition: "0.3s",
              fontWeight: "bold",
            }}
          >
            📍 Offline
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder={
            activeTab === "online" ? "Search for online peers..." : "Enter location..."
          }
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "1rem",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            borderRadius: "8px",
            marginBottom: "10px",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            outline: "none",
            textAlign: "center",
          }}
        />

        {/* Search Button */}
        <button
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "1rem",
            background: "#06beb6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.3s",
            fontWeight: "bold",
          }}
          onClick={() => alert("Searching...")}
        >
          🔍 Search
        </button>
      </div>
    </div>
  );
}