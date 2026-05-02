"use client";
import { useState } from "react";

export default function Calibration() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const startCalibration = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/calibrate");
      const data = await res.json();
      setResult(data.data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎯 Calibration</h1>

      <p>
        Please keep your eyes open and mouth relaxed during calibration.
      </p>

      <button
        onClick={startCalibration}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Calibrating..." : "Start Calibration"}
      </button>

      {loading && <p>📷 Camera running... Please wait</p>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>✅ Calibration Complete</h3>
          <p>EAR Mean: {result.ear_mean}</p>
          <p>EAR Std: {result.ear_std}</p>
          <p>MAR Mean: {result.mar_mean}</p>
          <p>MAR Std: {result.mar_std}</p>
        </div>
      )}
    </div>
  );
}