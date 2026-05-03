"use client";
import { useState } from "react";

export default function Calibration() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const start = async () => {
    await fetch("http://127.0.0.1:5000/api/start_calibration");
    setRunning(true);
    setResult(null);
  };

  const stop = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/stop_calibration");
    const data = await res.json();
    setResult(data);
    setRunning(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎯 Calibration Dashboard</h1>

      <div style={styles.grid}>

        {/* 🎥 LEFT: VIDEO */}
        <div style={styles.videoCard}>
          <h3>Live Camera</h3>
          <img
            src="http://127.0.0.1:5000/video_feed"
            style={styles.video}
          />
        </div>

        {/* 🧠 RIGHT: CONTROLS */}
        <div style={styles.controlCard}>
          <h3>Controls</h3>

          {!running ? (
            <button onClick={start} style={styles.startBtn}>
              ▶ Start Calibration
            </button>
          ) : (
            <button onClick={stop} style={styles.stopBtn}>
              ⏹ Stop & Save
            </button>
          )}

          <hr style={{ margin: "20px 0" }} />

          <h3>Results</h3>

          {result ? (
            <div style={styles.resultBox}>
              <p><b>EAR Mean:</b> {result.ear_mean.toFixed(4)}</p>
              <p><b>EAR Std:</b> {result.ear_std.toFixed(4)}</p>
              <p><b>MAR Mean:</b> {result.mar_mean.toFixed(4)}</p>
              <p><b>MAR Std:</b> {result.mar_std.toFixed(4)}</p>
            </div>
          ) : (
            <p style={{ color: "#888" }}>No data yet</p>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f5f7fb",
    minHeight: "100vh"
  },

  title: {
    marginBottom: "20px"
  },

  grid: {
    display: "flex",
    gap: "20px"
  },

  videoCard: {
    flex: 2,
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  video: {
    width: "100%",
    borderRadius: "10px"
  },

  controlCard: {
    flex: 1,
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  startBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  },

  stopBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  },

  resultBox: {
    background: "#f1f3f6",
    padding: "15px",
    borderRadius: "8px"
  }
};