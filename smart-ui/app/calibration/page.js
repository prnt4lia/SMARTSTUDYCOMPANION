"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Camera,
  Play,
  RotateCcw,
  CheckCircle2,
  Activity,
  Target,
} from "lucide-react";

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
            user_id: user.user_id,
          }),
        }
      );

      await res.json();

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

  return (
    <main style={styles.page}>
      <div style={styles.backgroundGlow1}></div>
      <div style={styles.backgroundGlow2}></div>

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <Brain size={14} />
            AI Calibration System
          </div>

          <h1 style={styles.title}>
            Calibration Dashboard
          </h1>

          <p style={styles.subtitle}>
            Personalize your fatigue detection accuracy.
          </p>
        </div>
        <button
              style={styles.backBtn}
              onClick={() => router.push("/dashboard")}
            >
              ← Back to Dashboard
            </button>
<div style={{ height: "30px" }}></div>
        <div style={styles.grid}>
          {/* CAMERA */}
          <div style={styles.videoCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <Camera size={20} />
                Live Camera Feed
              </h2>

              <div style={styles.liveBadge}>
                <span style={styles.liveDot}></span>
                LIVE
              </div>
            </div>

            <img
              src="http://127.0.0.1:5000/video_feed"
              style={styles.video}
            />
          </div>

          {/* CONTROL PANEL */}
          <div style={styles.controlCard}>
            <h2 style={styles.cardTitle}>
              <Target size={20} />
              Calibration Controls
            </h2>

            {/* INSTRUCTIONS */}
            <div style={styles.instructionBox}>
              <h3 style={styles.instructionTitle}>
                📌 Instructions
              </h3>

              <ul style={styles.instructions}>
                <li>Keep your head straight</li>
                <li>Blink naturally a few times</li>
                <li>Keep your mouth relaxed</li>
                <li>Avoid opening mouth widely</li>
                <li>Stay within the camera frame</li>
              </ul>
            </div>

            {/* BUTTONS */}
            {!running && !completed && (
              <button onClick={start} style={styles.startBtn}>
                <Play size={18} />
                Start Calibration
              </button>
            )}

            {running && (
              <div style={styles.runningBox}>
                ⏳ Calibration in progress...
              </div>
            )}

            {completed && (
              <>
                <div style={styles.successBox}>
                  <CheckCircle2 size={18} />
                  Calibration Successful
                </div>

                <button
                  style={styles.recalibrateBtn}
                  onClick={() => {
                    setCompleted(false);

                    setResult(null);

                    start();
                  }}
                >
                  <RotateCcw size={18} />
                  Recalibrate
                </button>

                <button
                  style={styles.detectorBtn}
                  onClick={() =>
                    router.push("/fatigue_detector")
                  }
                >
                  <Activity size={18} />
                  Start Fatigue Detector
                </button>
              </>
            )}

            {/* RESULTS */}
            <div style={styles.resultsSection}>
              <h2 style={styles.cardTitle}>
                <Brain size={20} />
                Calibration Results
              </h2>

              {result ? (
                <div style={styles.resultGrid}>
                  <div style={styles.resultCard}>
                    <span>EAR Mean</span>

                    <h3>
                      {result.ear_mean.toFixed(4)}
                    </h3>
                  </div>

                  <div style={styles.resultCard}>
                    <span>EAR Std</span>

                    <h3>
                      {result.ear_std.toFixed(4)}
                    </h3>
                  </div>

                  <div style={styles.resultCard}>
                    <span>MAR Mean</span>

                    <h3>
                      {result.mar_mean.toFixed(4)}
                    </h3>
                  </div>

                  <div style={styles.resultCard}>
                    <span>MAR Std</span>

                    <h3>
                      {result.mar_std.toFixed(4)}
                    </h3>
                  </div>
                </div>
              ) : (
                <p style={styles.emptyText}>
                  No calibration data yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f5f0",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Inter, sans-serif",
    padding: "40px 0",
  },

  backgroundGlow1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "#f3e8d7",
    borderRadius: "50%",
    filter: "blur(120px)",
    top: "-120px",
    left: "-120px",
    opacity: 0.8,
  },

  backgroundGlow2: {
    position: "absolute",
    width: "350px",
    height: "350px",
    background: "#efe1cf",
    borderRadius: "50%",
    filter: "blur(120px)",
    bottom: "-120px",
    right: "-80px",
    opacity: 0.7,
  },

  container: {
    width: "92%",
    maxWidth: "1450px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },

  header: {
    marginBottom: "28px",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#f7efe4",
    color: "#8b6f47",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "18px",
  },

  title: {
    fontSize: "3rem",
    color: "#3d342b",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#6b5b4d",
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
  },

  videoCard: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: "28px",
    padding: "28px",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    height: "fit-content",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  cardTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#3d342b",
    fontSize: "20px",
  },

  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#fef2f2",
    color: "#dc2626",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 600,
  },

  liveDot: {
    width: "8px",
    height: "8px",
    background: "#dc2626",
    borderRadius: "50%",
  },

  video: {
    width: "100%",
    borderRadius: "22px",
    border: "1px solid #eadccf",
  },

  controlCard: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: "28px",
    padding: "28px",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  instructionBox: {
    background: "#fffdf9",
    border: "1px solid #eee2d3",
    padding: "22px",
    borderRadius: "22px",
  },

  instructionTitle: {
    marginTop: 0,
    marginBottom: "14px",
    color: "#5f5145",
  },

  instructions: {
    paddingLeft: "18px",
    lineHeight: "2",
    color: "#6b5b4d",
    fontSize: "14px",
    margin: 0,
  },

  startBtn: {
    width: "100%",
    padding: "16px",
    background: "#a67c52",
    color: "white",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow: "0 8px 20px rgba(166,124,82,0.2)",
  },

  runningBox: {
    padding: "18px",
    background: "#fff7ed",
    borderRadius: "18px",
    textAlign: "center",
    fontWeight: 600,
    color: "#c2410c",
    border: "1px solid #fed7aa",
  },

  successBox: {
    padding: "18px",
    background: "#ecfdf5",
    color: "#15803d",
    borderRadius: "18px",
    textAlign: "center",
    fontWeight: 600,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #bbf7d0",
  },

  recalibrateBtn: {
    width: "100%",
    padding: "16px",
    background: "#d97706",
    color: "white",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  detectorBtn: {
    width: "100%",
    padding: "16px",
    background: "#a67c52",
    color: "white",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow: "0 8px 20px rgba(166,124,82,0.2)",
  },

  resultsSection: {
    marginTop: "10px",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginTop: "18px",
  },

  resultCard: {
    background: "#fffdf9",
    border: "1px solid #eee2d3",
    padding: "18px",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#5f5145",
  },

  emptyText: {
    marginTop: "18px",
    color: "#8b6f47",
  },

   backBtn: {
    marginTop: "20px",
    padding: "14px 22px",
    borderRadius: "16px",
    border: "1px solid #e7d8c7",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    color: "#7c5f3f",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },
};