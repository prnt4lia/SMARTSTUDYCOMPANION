"use client";
import { useEffect, useState } from "react";

export default function FatiguePage() {
  const [status, setStatus] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [lastAlert, setLastAlert] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/fatigue");
        const data = await res.json();
        setStatus(data);

        // Trigger popup ONLY when fatigue exists
      if (
          data.fatigue &&
          data.severity === "high" &&
          data.fatigue !== lastAlert
      ) {
          setPopupData(data);
          setShowPopup(true);
          setLastAlert(data.fatigue);
}

      } catch (err) {
        console.error(err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    if (!status?.severity) return "#ccc";
    if (status.severity === "low") return "#FFA500";
    if (status.severity === "high") return "#FF4D4D";
    return "#4CAF50";
  };


  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.title}>🧠 Fatigue Detection Dashboard</h1>

        <div style={styles.grid}>

          {/* 🎥 CAMERA */}
          <div style={styles.videoCard}>
            <h3>Live Monitoring</h3>
            <img
              src="http://127.0.0.1:5000/video_feed"
              style={styles.video}
            />
          </div>

          {/* 📊 STATUS + RECOMMENDATION */}
          <div style={styles.sidePanel}>

            <div style={{...styles.statusBox, borderColor: getColor()}}>
              <h3>Status</h3>
              <p><b>Fatigue Type:</b> {status?.fatigue || "None"}</p>
              <p><b>Severity:</b> {status?.severity || "Normal"}</p>
            </div>

            <div style={styles.recommendBox}>
              <h3>💡 Smart Recommendation</h3>

              {status?.recommendation ? (
                <>
                  <p><b>Activity:</b> {status.recommendation.activity}</p>
                  <p><b>Duration:</b> {status.recommendation.duration}</p>
                </>
              ) : (
                <p>No recommendation yet</p>
              )}
            </div>

          </div>

        </div>
      </div>
      {showPopup && popupData && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2>⚠️ Fatigue Alert</h2>

            <p><b>Type:</b> {popupData.fatigue}</p>
            <p><b>Severity:</b> {popupData.severity}</p>

            <p style={{ marginTop: "10px" }}>
              <b>Activity:</b> {popupData?.recommendation?.activity}
            </p>
            <p>
              <b>Duration:</b> {popupData?.recommendation?.duration}
            </p>

            <div style={styles.popupButtons}>
              <button
                style={styles.breakBtn}
                onClick={() => {
                  alert("⏳ Break started!");
                  setShowPopup(false);
                }}
              >
                Take Break
              </button>

              <button
                style={styles.continueBtn}
                onClick={() => setShowPopup(false)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Segoe UI",
    background: "#f4f7fb",
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
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },

  video: {
    width: "100%",
    borderRadius: "10px"
  },

  sidePanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  statusBox: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    borderLeft: "6px solid",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },

  recommendBox: {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderLeft: "6px solid #4CAF50"
},

  overlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
},

  popup: {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "350px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
},

  popupButtons: {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px"
},

  breakBtn: {
  backgroundColor: "#FF4D4D",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer"
},

  continueBtn: {
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer"
}
};