"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {

const router = useRouter();

  return (
    <div style={styles.container}>
      
      <h1 style={styles.title}>Welcome to Smart Study Companion</h1>

      <p style={styles.subtitle}>
        Your AI-powered fatigue detection and study assistant
      </p>

      <div style={styles.buttonContainer}>
        <button style={styles.loginButton} onClick={() => router.push("/login")}>          
          Login
        </button>

        <button style={styles.registerButton} onClick={() => router.push("/register")}>
          Register
        </button>
      </div>

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
    color: "white",
    textAlign: "center" as const
  },

  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "10px"
  },

  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "30px"
  },

  buttonContainer: {
    display: "flex",
    gap: "20px"
  },

  loginButton: {
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    color: "#333"
  },

  registerButton: {
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "2px solid white",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "white"
  }
};