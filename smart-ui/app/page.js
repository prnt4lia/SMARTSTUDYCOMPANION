"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [fatigue, setFatigue] = useState(null);
  const [severity, setSeverity] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("http://127.0.0.1:5000/fatigue_status");
      const data = await res.json();

      setFatigue(data.fatigue);
      setSeverity(data.severity);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📚 Smart Study Companion</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        
        {/* 🎥 VIDEO */}
        <div>
          <h2>Live Camera</h2>
          <img src="http://127.0.0.1:5000/video_feed" width="500" />
        </div>

        {/* 📊 STATUS */}
        <div>
          <h2>Fatigue Status</h2>
          <p>{fatigue || "No fatigue"}</p>
          <p>{severity}</p>
        </div>

        <a href="/stats">📊 View Statistics</a>
        
      </div>
    </div>
  );
}