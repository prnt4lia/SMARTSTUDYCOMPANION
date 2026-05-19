"use client";
import { useEffect, useState } from "react";

export default function FatiguePage() {
  const [status, setStatus] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [lastAlert, setLastAlert] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  if (!detecting) return;

  const interval = setInterval(async () => {

    try {
      const res = await fetch("http://127.0.0.1:5000/api/fatigue");
      const data = await res.json();

      console.log(data);

      setStatus(data);

      if (
        data.fatigue &&
        data.severity &&
        `${data.fatigue}-${data.severity}` !== lastAlert
      ) {
        console.log("POPUP TRIGGERED");

        setPopupData(data);
        setShowPopup(true);
        setLastAlert(`${data.fatigue}-${data.severity}`);
      }

    } catch (err) {
      console.error(err);
    }

  }, 1000);

  return () => clearInterval(interval);

}, [detecting, lastAlert]);

  const getColor = () => {
    if (!status?.severity) return "#ccc";
    if (status.severity === "low") return "#FFA500";
    if (status.severity === "high") return "#FF4D4D"
    return "#4CAF50";
  };

  const startDetection = async () => {
    await fetch("http://127.0.0.1:5000/api/start_detection",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"      },
      body: JSON.stringify({ user_id: user.user_id })    
    });
    setDetecting(true);
  };

  const stopDetection = async () => {
    await fetch("http://127.0.0.1:5000/api/stop_detection",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id: user.user_id })
    });
    setDetecting(false);
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

            {/*  CONTROL BUTTON */}
            <div style={{ background: "white", padding: "20px", borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>

              <h3>Controls</h3>

              {!detecting ? (
                <button onClick={startDetection} style={styles.startBtn}>
                  ▶ Start Detection
                </button>
              ) : (
                <button onClick={stopDetection} style={styles.stopBtn}>
                  ⏹ Stop Detection
                </button>
              )}

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
                  setLastAlert(null);
                }}
              >
                Take Break
              </button>

              <button
                style={styles.continueBtn}
               onClick={() => {
                              setShowPopup(false);
                              setLastAlert(null);
                              }}
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
},

startBtn: {
  width: "100%",
  padding: "14px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold"
},

stopBtn: {
  width: "100%",
  padding: "14px",
  backgroundColor: "#ff4d4d",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold"
}
};