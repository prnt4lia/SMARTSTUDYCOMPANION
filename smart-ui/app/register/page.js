"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();
      

      if (data.success) {
        setMessage("Registration successful! Redirecting...");

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed");
    }

    setLoading(false);
  };

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
          Create Account
        </div>

        <h1 style={styles.title}>Register</h1>

        <p style={styles.subtitle}>
          Start your smarter and healthier study journey.
        </p>

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && <p style={styles.success}>{message}</p>}

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.text}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </p>
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
    background: "#f8f5f0",
    overflow: "hidden",
    position: "relative",
    fontFamily: "Inter, sans-serif",
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

  card: {
    width: "420px",
    padding: "50px 40px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
    border: "1px solid rgba(255,255,255,0.6)",
    textAlign: "center",
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
    marginBottom: "20px",
  },

  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#3d342b",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#6b5b4d",
    marginBottom: "35px",
    fontSize: "15px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  input: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #e7d8c7",
    background: "#fffdf9",
    fontSize: "15px",
    outline: "none",
    color: "#3d342b",
  },

  button: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background: "#a67c52",
    color: "white",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "5px",
    boxShadow: "0 6px 18px rgba(166,124,82,0.2)",
  },

  success: {
    color: "#15803d",
    marginTop: "15px",
    fontSize: "14px",
  },

  error: {
    color: "#dc2626",
    marginTop: "15px",
    fontSize: "14px",
  },

  text: {
    marginTop: "25px",
    color: "#6b5b4d",
    fontSize: "15px",
  },

  link: {
    color: "#a67c52",
    cursor: "pointer",
    fontWeight: 600,
  },
};