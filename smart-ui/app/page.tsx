"use client";

import React from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Brain, Sparkles } from "lucide-react";

export default function Home() {
  const router = useRouter();

 return (
  <main style={styles.page as CSSProperties}>
    <div style={styles.overlay}></div>

    
    <div style={styles.container}>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <Brain size={28} />
          SSC
        </div>
      </nav>

      {/* HERO SECTION */}
      <div style={styles.hero}>

        {/* LEFT SIDE */}
        <div style={styles.leftSection as CSSProperties}>
          <div style={styles.badge}>
            <Sparkles size={14} />
            Smart Learning Assistant
          </div>

          <h1 style={styles.title}>
            Smart Study
            <br />
            <span style={styles.highlight}>Companion</span>
          </h1>

          <p style={styles.subtitle}>
            AI-powered fatigue detection and productivity tracking
            for focused studying.
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

      </div>
    </div>
  </main>
);
}

const styles = {
  page: {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: "url('/card-bg.webp')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative" as const,
  overflow: "hidden",
  fontFamily: "Inter, sans-serif",
} as const,

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

container: {
  width: "90%",
  maxWidth: "1300px",
  zIndex: 2,
},

navbar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "60px",
},

logo: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "24px",
  fontWeight: 700,
  color: "#8b6f47",
},

navLinks: {
  display: "flex",
  gap: "40px",
  color: "#5f5145",
  fontWeight: 500,
},

navButton: {
  padding: "12px 24px",
  border: "none",
  borderRadius: "12px",
  background: "#a67c52",
  color: "white",
  cursor: "pointer",
  fontWeight: 600,
},

hero: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},

leftSection: {
  maxWidth: "700px",
  textAlign: "center",
  margin: "0 auto",
},

rightSection: {
  flex: 1,
  position: "relative" as const,
  borderRadius: "24px",
  overflow: "hidden",
},

bgImage: {
  position: "absolute" as const,
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  opacity: 0.35,
},

overlay: {
  position: "absolute" as const,
  inset: 0,
  background: "rgba(255,255,255,0.55)",
},

};