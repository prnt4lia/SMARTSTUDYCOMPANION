"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Brain, Sparkles } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main style={styles.page}>
      <div style={styles.backgroundGlow1}></div>
      <div style={styles.backgroundGlow2}></div>

      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <Brain size={32} color="#8b6f47" />
        </div>

        <div style={styles.badge}>
          <Sparkles size={14} />
          Smart Learning Assistant
        </div>

        <h1 style={styles.title}>
          Smart Study <span style={styles.highlight}>Companion</span>
        </h1>

        <p style={styles.subtitle}>
          AI-powered fatigue detection and productivity tracking for focused
          studying.
        </p>

        <div style={styles.featureContainer}>
          <div style={styles.feature}>
            <BookOpen size={18} />
            Study Tracking
          </div>

          <div style={styles.feature}>
            <Brain size={18} />
            Fatigue Detection
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button
            style={styles.loginButton}
            onClick={() => router.push("/login")}
          >
            Login
          </button>

          <button
            style={styles.registerButton}
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8f5f0",
    overflow: "hidden",
    position: "relative" as const,
    fontFamily: "Inter, sans-serif",
  },

  backgroundGlow1: {
    position: "absolute" as const,
    width: "400px",
    height: "400px",
    background: "#f3e8d7",
    borderRadius: "50%",
    filter: "blur(120px)",
    top: "-100px",
    left: "-100px",
    opacity: 0.8,
  },

  backgroundGlow2: {
    position: "absolute" as const,
    width: "350px",
    height: "350px",
    background: "#efe1cf",
    borderRadius: "50%",
    filter: "blur(120px)",
    bottom: "-120px",
    right: "-80px",
    opacity: 0.7,
  },

  card: {
    width: "90%",
    maxWidth: "650px",
    padding: "60px 40px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
    border: "1px solid rgba(255,255,255,0.6)",
    textAlign: "center" as const,
    zIndex: 2,
  },

  iconWrapper: {
    width: "72px",
    height: "72px",
    margin: "0 auto 20px",
    borderRadius: "20px",
    background: "#faf4eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: "22px",
  },

  title: {
    fontSize: "3.2rem",
    fontWeight: 700,
    color: "#3d342b",
    marginBottom: "16px",
    lineHeight: 1.1,
  },

  highlight: {
    color: "#a67c52",
  },

  subtitle: {
    fontSize: "1.1rem",
    color: "#6b5b4d",
    lineHeight: 1.7,
    maxWidth: "500px",
    margin: "0 auto 30px",
  },

  featureContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap" as const,
    marginBottom: "40px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fffdf9",
    padding: "12px 18px",
    borderRadius: "14px",
    border: "1px solid #eee2d3",
    color: "#5f5145",
    fontSize: "14px",
    fontWeight: 500,
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap" as const,
  },

  loginButton: {
    padding: "14px 32px",
    borderRadius: "14px",
    border: "none",
    background: "#a67c52",
    color: "white",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s ease",
    boxShadow: "0 6px 18px rgba(166,124,82,0.2)",
  },

  registerButton: {
    padding: "14px 32px",
    borderRadius: "14px",
    border: "1px solid #d8c7b5",
    background: "white",
    color: "#5f5145",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s ease",
  },
};