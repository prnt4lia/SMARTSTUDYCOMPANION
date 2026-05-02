"use client";

import { useEffect, useState } from "react";

export default function Stats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Statistics</h1>

      <p>Duration: {stats.duration} sec</p>
      <p>Fatigue Count: {stats.fatigue_count}</p>
      <p>Eye: {stats.eye}</p>
      <p>Mental: {stats.mental}</p>
    </div>
  );
}