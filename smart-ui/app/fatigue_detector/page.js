"use client";

import { useEffect, useState, useRef} from "react";
import {
  Brain,
  Activity,
  Lightbulb,
  Play,
  Square,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function FatiguePage() {
  const [status, setStatus] = useState(null);
  const [warningPopup, setWarningPopup] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [lastAlert, setLastAlert] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [user, setUser] = useState(null);
  const alertSound = useRef(null);
  const [alertPlayed, setAlertPlayed] = useState(false);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const router = useRouter();

  useEffect(() => {
  alertSound.current = new Audio("/alert.mp3");
  }, []);

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

        setStatus(data);

        if (data.warning) {
          setWarningMessage(data.warning);
          setWarningPopup(true);

        } else {

          setWarningPopup(false);
        }

        if (
          data.fatigue &&
          data.severity &&
          `${data.fatigue}-${data.severity}` !== lastAlert
        ) {

          console.log("PLAYING SOUND");

          alertSound.current?.play();
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

  const getStatusColor = () => {
    if (!status?.severity) return "#a67c52";

    if (status.severity === "low") return "#d97706";

    if (status.severity === "high") return "#dc2626";

    return "#15803d";
  };

  const startDetection = async () => {
    await fetch("http://127.0.0.1:5000/api/start_detection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user.user_id }),
    });

    setStudyTime(0);
      const interval = setInterval(() => {
      setStudyTime(prev => prev + 1);
    }, 1000);

    window.studyTimer = interval;
    setDetecting(true);
};

  const stopDetection = async () => {
    await fetch("http://127.0.0.1:5000/api/stop_detection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user.user_id }),
    });
     clearInterval(window.studyTimer);
    setDetecting(false);
  };

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2,"0")}:${mins
      .toString()
      .padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
    }

let popupTitle = "";
let popupMessage = "";

    if (popupData?.fatigue === "eye_fatigue") {
      popupTitle = "👀 Time for an Eye Break";

      popupMessage = `Hi ${user?.username || "there"}! We've noticed signs of eye strain during your study session. Taking a short break now can help refresh your eyes and improve focus.`;
    }

    if (popupData?.fatigue === "mental_fatigue") {
      popupTitle = "🧠 You Might Be Feeling Tired";

      popupMessage = `Hi ${user?.username || "there"}! We've noticed signs that your concentration may be decreasing. A short break can help you recharge and stay productive.`;
    }

  return (
    <>
      <main style={styles.page}>
        <div style={styles.backgroundGlow1}></div>
        <div style={styles.backgroundGlow2}></div>

        <div style={styles.container}>
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.badge}>
              <Brain size={14} />
              AI Fatigue Monitoring
            </div>

            <h1 style={styles.title}>
              Fatigue Detection Dashboard
            </h1>

            <p style={styles.subtitle}>
              Real-time monitoring for healthier study sessions.
            </p>

            {showResumeBanner && (
                <div style={styles.resumeBanner}>
                  <p>
                    🎉 Break completed successfully.
                    Your study session is currently paused.
                  </p>

                  <button
                    onClick={async () => {

                      await fetch(
                        "http://127.0.0.1:5000/api/resume_detection",
                        {
                          method: "POST"
                        }
                      );
                    }}
                  >
                    Resume Study Session
                  </button>
                </div>
              )}

            <button
              style={styles.backBtn}
              onClick={() => router.push("/dashboard")}
            >
              ← Back to Dashboard
            </button>
          </div>

          <div style={styles.grid}>
            {/* CAMERA */}
            <div style={styles.videoCard}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <Activity size={20} />
                  Live Monitoring
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

            {/* SIDE PANEL */}
            <div style={styles.sidePanel}>
              {/* STUDY TIMER */}
              <div style={styles.studyTimer}>
              <div style={styles.timerIcon}>⏱️</div>
              <div style={styles.timerLabel}>
              Study Time
              </div>
              <div style={styles.timerValue}>
              {formatTime(studyTime)}
            </div>
          </div>
              {/* STATUS */}
              <div
                style={{
                  ...styles.statusCard,
                  borderColor: getStatusColor(),
                }}
              >
                <h2 style={styles.cardTitle}>
                  <Brain size={20} />
                  Detection Status
                </h2>

                <div style={styles.statusContent}>
                  <div style={styles.statusRow}>
                    <span>Fatigue Type</span>

                    <strong>
                      {status?.fatigue || "None"}
                    </strong>
                  </div>

                  <div style={styles.statusRow}>
                    <span>Severity</span>

                    <strong
                      style={{
                        color: getStatusColor(),
                      }}
                    >
                      {status?.severity || "Normal"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* CONTROLS */}
              <div style={styles.controlCard}>
                <h2 style={styles.cardTitle}>
                  <Play size={20} />
                  Controls
                </h2>

                {!detecting ? (
                  <button
                    onClick={startDetection}
                    style={styles.startBtn}
                  >
                    <Play size={18} />
                    Start Detection
                  </button>
                ) : (
                  <button
                    onClick={stopDetection}
                    style={styles.stopBtn}
                  >
                    <Square size={18} />
                    Stop Detection
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* POPUP */}
      {showPopup && popupData && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={styles.popupIcon}>
              <AlertTriangle size={30} color="#dc2626" />
            </div>

            <h2 style={styles.popupTitle}>
              {popupTitle}
            </h2>
            <p style={styles.popupMessage}>
              {popupMessage}
            </p>

            <div style={styles.popupContent}>
            

              <div style={styles.popupRow}>
                <span>Recommended Activity</span>

                <strong>
                  {popupData?.recommendation?.activity}
                </strong>
              </div>

              <div style={styles.popupRow}>
                <span>Suggested Duration</span>

                <strong>
                  {popupData?.recommendation?.duration}
                </strong>
              </div>
            </div>

            <div style={styles.popupButtons}>
              <button
                style={styles.breakBtn}
                onClick={() => {
                  alert("⏳ Break started!");
                  setShowPopup(false);

                  router.push(
                    `/break?fatigue=${popupData.fatigue}&severity=${popupData.severity}`
                  );

                }}
                    >
                Start Break
              </button>

              <button
                style={styles.continueBtn}
                onClick={() => {
                  setShowPopup(false);
                  setLastAlert(null);
                }}
              >
                Continue Studying
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WARNING POPUP */}
      {warningPopup && (
      <div style={styles.warningToast}>
      <div style={styles.warningHeader}>
      <AlertTriangle size={18} />
      Warning
      </div>
        <p style={styles.warningText}>{warningMessage}
        </p>

        </div>

      )}
    </>
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
    objectFit: "cover",
    border: "1px solid #eadccf",
  },

  sidePanel: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  statusCard: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: "28px",
    padding: "28px",
    border: "2px solid",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },

  statusContent: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#5f5145",
  },

  controlCard: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: "28px",
    padding: "28px",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },

  recommendCard: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: "28px",
    padding: "28px",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },

  recommendContent: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  recommendItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    color: "#5f5145",
  },

  emptyText: {
    marginTop: "18px",
    color: "#8b6f47",
  },

  startBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "18px",
    border: "none",
    background: "#a67c52",
    color: "white",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
    boxShadow: "0 8px 20px rgba(166,124,82,0.2)",
  },

  stopBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "18px",
    border: "none",
    background: "#dc2626",
    color: "white",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    backdropFilter: "blur(6px)",
  },

  popup: {
  width: "360px",
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(16px)",
  borderRadius: "28px",
  padding: "28px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  textAlign: "center",
},

  popupIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 20px",
    borderRadius: "20px",
    background: "#fef2f2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  popupTitle: {
    color: "#3d342b",
    marginBottom: "25px",
  },

  popupContent: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginTop: "20px",
  textAlign: "left",
},

  popupRow: {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  color: "#5f5145",
  background: "#fffdf9",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #eee2d3",
  fontSize: "14px",
},

  popupButtons: {
    display: "flex",
    gap: "14px",
    marginTop: "28px",
  },

  breakBtn: {
    flex: 1,
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "16px",
    cursor: "pointer",
    fontWeight: 600,
  },

  continueBtn: {
    flex: 1,
    background: "#a67c52",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "16px",
    cursor: "pointer",
    fontWeight: 600,
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

  warningToast: {
  position: "fixed",
  top: "30px",
  right: "30px",
  width: "320px",
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(18px)",
  border: "1px solid #fecaca",
  borderLeft: "6px solid #dc2626",
  borderRadius: "20px",
  padding: "18px 20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  zIndex: 9999,
  animation: "slideIn 0.3s ease",
},

warningHeader: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#dc2626",
  fontWeight: 700,
  marginBottom: "10px",
  fontSize: "15px",
},

warningText: {
  color: "#5f5145",
  fontSize: "14px",
  lineHeight: 1.5,
},

studyTimer: {
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(14px)",
  borderRadius: "24px",
  padding: "22px",
  border: "1px solid rgba(255,255,255,0.6)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  marginBottom: "22px",
},

timerLabel: {
  color: "#8b6f47",
  fontSize: "13px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "8px",
},

timerValue: {
  color: "#3d342b",
  fontSize: "2rem",
  fontWeight: 700,
  fontFamily: "monospace",
},

timerIcon: {
  fontSize: "28px",
  marginBottom: "10px",
},

popupMessage: {
  color: "#6b5b4d",
  fontSize: "15px",
  lineHeight: 1.6,
  marginBottom: "20px",
  textAlign: "center",
},

resumeBanner: {
  background: "#ecfdf5",
  border: "1px solid #86efac",
  borderRadius: "16px",
  padding: "16px",
  marginTop: "20px",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#166534",
},
};