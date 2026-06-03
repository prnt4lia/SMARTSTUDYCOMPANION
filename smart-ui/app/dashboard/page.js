"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Activity,
  Timer,
  Target,
  BookOpen,
  LogOut,
  Play,
  RefreshCw,
  User,
} from "lucide-react";
import FatigueTrend from "../../components/FatigueTrend";
import Sidebar from "../../components/Sidebar";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [calibration, setCalibration] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    setUser(parsedUser);

    loadDashboard(parsedUser.user_id);
  }, []);

  const loadDashboard = async (userId) => {
    try {
      const statsRes = await fetch(
        `http://127.0.0.1:5000/api/user_stats/${userId}`
      );

      const statsData = await statsRes.json();

      setStats(statsData);

      const calibrationRes = await fetch(
        `http://127.0.0.1:5000/api/latest_calibration/${userId}`
      );

      const calibrationData = await calibrationRes.json();

      setCalibration(calibrationData);

      const sessionRes = await fetch(
        `http://127.0.0.1:5000/api/user_sessions/${userId}`
      );

      const sessionData = await sessionRes.json();

      setSessions(sessionData.sessions || []);

      const trendRes = await fetch(
        `http://127.0.0.1:5000/api/fatigue-trend/${userId}`
      );

      const trendData = await trendRes.json();

setTrendData(trendData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");

    router.push("/login");
  };

  if (loading) {
    return (

      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <Brain size={40} color="#a67c52" />
          <h2>Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
       <div style={{ display: "flex" }}>
       <Sidebar />
      <main
      style={{
        ...styles.page,
        marginLeft: "260px",
        width: "100%",
      }}
    >
      <div style={styles.backgroundGlow1}></div>
      <div style={styles.backgroundGlow2}></div>

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <div style={styles.badge}>
              <Brain size={14} />
              Smart Study Dashboard
            </div>

            <h1 style={styles.title}>Welcome back, {user?.username}</h1>

            <p style={styles.subtitle}>
              Monitor your fatigue levels and study performance.
            </p>
          </div>

        </div>

        {/* PROFILE CARD */}
        <div style={styles.profileCard}>
          <div style={styles.profileTop}>
            <div style={styles.profileIcon}>
              <User size={24} color="#8b6f47" />
            </div>

            <div>
              <h2 style={styles.profileTitle}>User Profile</h2>

              <p style={styles.profileText}>
                @{user?.username}
              </p>
            </div>
          </div>

          <div style={styles.userId}>
            User ID: {user?.user_id}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={styles.actionGrid}>
          <button
            style={styles.primaryBtn}
            onClick={() => router.push("/fatigue_detector")}
          >
            <Play size={18} />
            Start Fatigue Detector
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => router.push("/calibration")}
          >
            <RefreshCw size={18} />
            Recalibrate System
          </button>
        </div>


       
        </div>
    </main>

  </div>
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
  paddingLeft: "20px",
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
    maxWidth: "1400px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },

  loadingContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8f5f0",
  },

  loadingCard: {
    background: "white",
    padding: "40px",
    borderRadius: "24px",
    textAlign: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
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

  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fff",
    border: "1px solid #eadccf",
    padding: "14px 22px",
    borderRadius: "16px",
    cursor: "pointer",
    color: "#7c5f3f",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },

  profileCard: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: "28px",
    padding: "30px",
    marginBottom: "25px",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },

  profileTop: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  profileIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background: "#faf4eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  profileTitle: {
    margin: 0,
    color: "#3d342b",
  },

  profileText: {
    color: "#7a6a5d",
    marginTop: "6px",
  },

  userId: {
    marginTop: "20px",
    color: "#8b6f47",
    fontWeight: 600,
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  },

  primaryBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "18px",
    borderRadius: "20px",
    border: "none",
    background: "#a67c52",
    color: "white",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(166,124,82,0.2)",
  },

  secondaryBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "18px",
    borderRadius: "20px",
    border: "1px solid #e7d8c7",
    background: "white",
    color: "#7c5f3f",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "28px",
  },

  statCard: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: "24px",
    padding: "28px",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },

  statValue: {
    fontSize: "42px",
    fontWeight: 700,
    color: "#3d342b",
    marginTop: "12px",
  },

  card: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: "28px",
    padding: "30px",
    marginBottom: "28px",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },

  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#3d342b",
    marginBottom: "25px",
  },

  calibrationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  calibrationItem: {
    background: "#fffdf9",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid #eee2d3",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 12px",
  },
};
