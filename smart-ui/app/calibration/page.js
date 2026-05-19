"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Calibration() {

  const [user, setUser] = useState(null);
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

}, []);

const start = async () => {

  try {

    const user = JSON.parse(localStorage.getItem("user"));

    console.log(user);

    if (!user) {
    alert("Please login first");
    return;
  }

    const res = await fetch(
      "http://127.0.0.1:5000/api/start_calibration",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: user.user_id
        }),
      }
    );

    const data = await res.json();

    console.log(data);

    setRunning(true);
    setResult(null);

  } catch (err) {

    console.error(err);
  }
};

  useEffect(() => {

  if (!running) return;

  const interval = setInterval(async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:5000/api/calibration_result"
      );

      const data = await res.json();

      if (data.status === "completed") {

        setResult(data);

        setRunning(false);

        setCompleted(true);

        clearInterval(interval);
      }

    } catch (err) {
      console.error(err);
    }

  }, 1000);

  return () => clearInterval(interval);

}, [running]);

  //const stop = async () => {
    //const res = await fetch("http://127.0.0.1:5000/api/stop_calibration");
    //const data = await res.json();
    //setResult(data);
    //setRunning(false);
  //};

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
            <div style={styles.instructionBox}>
                <h4 style={{ marginTop: 0 }}>📌 Calibration Instructions</h4>

                <ul style={styles.instructions}>
                <li>Keep your head straight</li>
                <li>Blink naturally a few times</li>
                <li>Keep your mouth relaxed</li>
                <li>Avoid opening mouth widely</li>
                <li>Stay within camera frame</li>
                </ul>
            </div>

          {!running && !completed && (
          <button onClick={start} style={styles.startBtn}>▶ Start Calibration
        </button>
    )}

          {running && (
          <div style={styles.runningBox}>⏳ Calibration in progress...
        </div>
    )}

          {completed && (
        <>
          <div style={styles.successBox}>✅ Calibration Successful
        </div>

    <button
      style={styles.recalibrateBtn}
      onClick={() => {
        setCompleted(false);
        setResult(null);
        start();
      }}
    >
      ↻ Recalibrate
    </button>

    <button
      style={styles.detectorBtn}
      onClick={() => router.push("/fatigue_detector")}
    >
      ▶ Start Fatigue Detector
    </button>
  </>
)}
          <hr style={{ margin: "20px 0" }} />

          <h3>Results</h3>

          {result ? (
            <>
              <div style={styles.resultBox}>
                <p><b>EAR Mean:</b> {result.ear_mean.toFixed(4)}</p>
                <p><b>EAR Std:</b> {result.ear_std.toFixed(4)}</p>
                <p><b>MAR Mean:</b> {result.mar_mean.toFixed(4)}</p>
                <p><b>MAR Std:</b> {result.mar_std.toFixed(4)}</p>
              </div>

              
            </>
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
  },

  detectorBtn: {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold"
},

runningBox: {
  padding: "15px",
  background: "#fff7e6",
  borderRadius: "10px",
  marginTop: "10px",
  textAlign: "center",
  fontWeight: "bold"
},

successBox: {
  padding: "15px",
  background: "#e8f5e9",
  color: "#2e7d32",
  borderRadius: "10px",
  marginTop: "10px",
  textAlign: "center",
  fontWeight: "bold"
},

recalibrateBtn: {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  backgroundColor: "#f59e0b",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold"
},

instructionBox: {
  background: "#eef4ff",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px",
  border: "1px solid #c7dbff"
},

instructions: {
  paddingLeft: "20px",
  lineHeight: "1.8",
  color: "#333",
  fontSize: "14px"
}

};