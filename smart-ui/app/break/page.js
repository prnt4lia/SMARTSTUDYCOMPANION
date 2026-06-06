"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BreakPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const fatigue = searchParams.get("fatigue");
  const severity = searchParams.get("severity");
  const [selectedTime, setSelectedTime] =useState(60);
  const [seconds, setSeconds] = useState(0);
  const [breakStarted, setBreakStarted] = useState(false);

  // Set break duration based on fatigue type
  useEffect(() => {

  if (fatigue === "eye_fatigue") {
    setSelectedTime(60);
  }

  else if (
    fatigue === "mental_fatigue" &&
    severity === "high"
  ) {
    setSelectedTime(300);
  }

  else if (fatigue === "mental_fatigue") {
    setSelectedTime(180);
  }

  }, [fatigue, severity]);

  // Countdown timer
  useEffect(() => {

  if (!breakStarted || seconds <= 0) return;

  const timer = setInterval(() => {

    setSeconds(prev => {

      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }

      return prev - 1;

    });

  }, 1000);

  return () => clearInterval(timer);

}, [seconds, breakStarted]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const getTitle = () => {

    if (fatigue === "eye_fatigue") {
      return "👀 Eye Recovery Break";
    }

    if (fatigue === "mental_fatigue") {
      return "🧠 Mental Recovery Break";
    }

    return "🌿 Take a Break";
  };

  const getAdvice = () => {

    if (fatigue === "eye_fatigue") {
      return (
        <>
          👀 Eye Fatigue Detected
          <br />
          Follow the 20-20-20 Rule
          <br />
          Look 20 feet away for 20 seconds.
          <br />
          Blink naturally and relax your eyes.
        </>
      );
    }

    if (fatigue === "mental_fatigue") {
      return (
        <>
          🧠 Mental Fatigue Detected
          <br />
          Stand up and stretch.
          <br />
          Take deep breaths.
          <br />
          Drink some water and relax.
        </>
      );
    }

    return (
      <>
        Relax and recharge.
      </>
    );
  };

  return (
    <main style={styles.page}>

      <div style={styles.overlay}>

        <h1 style={styles.title}>
          {getTitle()}
        </h1>

        <div style={styles.timeSelector}>

              <h3>Choose Break Duration</h3>

              <div style={styles.timeOptions}>

                <button
                  style={{
                    ...styles.timeButton,
                    ...(selectedTime === 30
                      ? styles.selectedTime
                      : {})
                  }}
                  onClick={() => setSelectedTime(30)}
                >
                  30 Seconds
                </button>

                <button
                  style={{
                    ...styles.timeButton,
                    ...(selectedTime === 60
                      ? styles.selectedTime
                      : {})
                  }}
                  onClick={() => {
                    console.log("1 minute selected");
                    setSelectedTime(60);
                  }}
                >
                  1 Minute
                </button>

                <button
                  style={{
                    ...styles.timeButton,
                    ...(selectedTime === 300
                      ? styles.selectedTime
                      : {})
                  }}
                  onClick={() => setSelectedTime(300)}
                >
                  5 Minutes
                </button>

                <button
                  style={{
                    ...styles.timeButton,
                    ...(selectedTime === 600
                      ? styles.selectedTime
                      : {})
                  }}
                  onClick={() => setSelectedTime(600)}
                >
                  10 Minutes
                </button>
              </div>
            </div>

            {!breakStarted && (
                <button
                  style={styles.startBreakBtn}
                  onClick={() => {
                    setSeconds(selectedTime);
                    setBreakStarted(true);
                  }}
                >
                  Start Break
                </button>
              )}

        <div style={styles.timer}>
          {minutes}:
          {remainingSeconds.toString().padStart(2, "0")}
        </div>

        <div style={styles.tip}>
          {getAdvice()}
        </div>

        <button
          style={styles.button}
          onClick={async() => {
           await fetch(
                  "http://127.0.0.1:5000/api/resume_detection",{ method: "POST" }
                );
                localStorage.setItem("breakCompleted","true");
                router.push("/fatigue_detector");
          }}
        >
          Resume Study
        </button>

      </div>

    </main>
  );
}

const styles = {
  page: {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
  },

  video: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
  },

  title: {
    fontSize: "3rem",
    marginBottom: "20px",
  },

  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "30px",
  },

  timer: {
    fontSize: "5rem",
    fontWeight: "bold",
    marginBottom: "30px",
  },

  tip: {
    fontSize: "1.1rem",
    maxWidth: "550px",
    marginBottom: "40px",
    lineHeight: 1.8,
  },

  button: {
    padding: "14px 28px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    background: "#a67c52",
    color: "white",
    fontSize: "16px",
  },

  timeSelector: {
  marginBottom: "30px",
  textAlign: "center",
},

timeOptions: {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: "15px",
},

timeButton: {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
  transition: "all 0.2s ease",
},

selectedTime: {
  background: "#a67c52",
  color: "white",
  border: "1px solid #a67c52",
  boxShadow: "0 4px 12px rgba(166,124,82,0.3)",
},

startBreakBtn: {
  marginTop: "20px",
  padding: "14px 28px",
  borderRadius: "14px",
  border: "none",
  background: "#a67c52",
  color: "white",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(166,124,82,0.3)",
},
};