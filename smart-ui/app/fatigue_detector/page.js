"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [running, setRunning] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      fetch("http://127.0.0.1:5000/fatigue_status")
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.error(err));
    }, 2000);

    return () => clearInterval(interval);
  }, [running]);

  const getColor = () => {
    if (!data || !data.fatigue) return "gray";
    if (data.severity === "high") return "red";
    if (data.severity === "low") return "orange";
    return "green";
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>📚 Smart Study Companion</h1>

      {/* ▶️ CONTROL */}
      <button
        onClick={() => setRunning(!running)}
        style={{
          padding: "10px 20px",
          backgroundColor: running ? "#ff4d4d" : "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        {running ? "⏹ Stop Detection" : "▶️ Start Detection"}
      </button>

      <div style={{ display: "flex", gap: "30px" }}>

        {/* 🎥 CAMERA PANEL */}
        <div style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "15px"
        }}>
          <h3>🎥 Live Camera</h3>

          {running ? (
            <img
              src="http://127.0.0.1:5000/video_feed"
              width="450"
              style={{ borderRadius: "10px" }}
            />
          ) : (
            <p>Camera is off</p>
          )}
        </div>

        {/* 🧠 STATUS PANEL */}
        <div style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          width: "300px"
        }}>
          <h3>🧠 Fatigue Status</h3>

          <div style={{
            height: "15px",
            backgroundColor: getColor(),
            borderRadius: "10px",
            marginBottom: "10px"
          }} />

          {data ? (
            <>
              <p><b>Type:</b> {data.fatigue || "None"}</p>
              <p><b>Severity:</b> {data.severity || "-"}</p>

              <hr />

              {/* 💡 RECOMMENDATION */}
              <h3>💡 Recommendation</h3>
              <div style={{
                background: "#f5f5f5",
                padding: "10px",
                borderRadius: "8px"
              }}>
                {data.recommendation || "No recommendation yet"}
              </div>
            </>
          ) : (
            <p>No data yet</p>
          )}
        </div>

      </div>
    </div>
  );
}