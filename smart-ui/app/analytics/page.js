"use client";

import { useEffect, useState } from "react";
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
import FatigueTimeChart from "../../components/FatigueTimeChart";

export default function AnalyticsPage() {

  const [calibration, setCalibration] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    loadAnalytics(user.user_id);

  }, []);

  const loadAnalytics = async (userId) => {

    const calibrationRes = await fetch(
      `http://127.0.0.1:5000/api/latest_calibration/${userId}`
    );

    const calibrationData = await calibrationRes.json();

    setCalibration(calibrationData);

    const trendRes = await fetch(
        `http://127.0.0.1:5000/api/fatigue-trend/${userId}`
      );

      const trendData = await trendRes.json();

    setTrendData(trendData);

    const sessionRes = await fetch(
      `http://127.0.0.1:5000/api/user_sessions/${userId}`
    );

    const sessionData = await sessionRes.json();

    setSessions(sessionData.sessions || []);
  

    const timeRes = await fetch(
      `http://127.0.0.1:5000/api/fatigue_time_distribution/${userId}`
  );

      const timeJson = await timeRes.json();

    setTimeData(timeJson);
  };

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
      <div style={styles.container}>

        <div style={styles.badge}>
          <Brain size={14}/>
          Analytics Dashboard
        </div>

        <h1 style={styles.title}>
          Study Analytics
        </h1>

        <p style={styles.subtitle}>
          Track your fatigue patterns and study habits.
        </p>

        {/* TREND CHART */}
        <div style={styles.Chartcard}>
          <h2>Fatigue Trend</h2>

          <FatigueTrend data={trendData}/>
        </div>

        {/* TIME DISTRIBUTION CHART */}
        <div style={styles.Chartcard}>
          <h2>Fatigue by Time of Day</h2>

          <FatigueTimeChart data={timeData} />
        </div>

          {timeData.length > 0 && (
            <div style={styles.insightCard}>
            💡 Your highest fatigue period is{" "}
            <b>
      {
        [...timeData].sort(
          (a, b) => b.count - a.count
        )[0].time
      }
    </b>
    . Consider taking a short break before this time.
  </div>
)}
        {/* CALIBRATION */}
               <div style={styles.card}>
                 <h2 style={styles.sectionTitle}>
                   <Target size={20} />
                   Latest Calibration Data
                 </h2>
       
                 {calibration ? (
                   <div style={styles.calibrationGrid}>
                     <div style={styles.calibrationItem}>
                       <span>EAR Mean</span>
                       <h3>{calibration.ear_mean?.toFixed(4)}</h3>
                     </div>
       
                     <div style={styles.calibrationItem}>
                       <span>EAR Std</span>
                       <h3>{calibration.ear_std?.toFixed(4)}</h3>
                     </div>
       
                     <div style={styles.calibrationItem}>
                       <span>MAR Mean</span>
                       <h3>{calibration.mar_mean?.toFixed(4)}</h3>
                     </div>
       
                     <div style={styles.calibrationItem}>
                       <span>MAR Std</span>
                       <h3>{calibration.mar_std?.toFixed(4)}</h3>
                     </div>
                   </div>
                 ) : (
                   <p>No calibration data available.</p>
                 )}
               </div>

        {/* SESSIONS */}
               <div style={styles.card}>
                 <h2 style={styles.sectionTitle}>
                   <Timer size={20} />
                   Study Sessions
                 </h2>
       
                 {sessions.length === 0 ? (
                   <p>No sessions recorded yet.</p>
                 ) : (
                   <div style={styles.tableWrapper}>
                     <table style={styles.table}>
                       <thead>
                         <tr>
                           <th>Session ID</th>
                           <th>Start Time</th>
                           <th>End Time</th>
                           <th>Duration</th>
                         </tr>
                       </thead>
       
                       <tbody>
                         {sessions.map((session) => (
                           <tr key={session.id}>
                             <td>{session.id}</td>
                             <td>{session.start_time}</td>
                             <td>{session.end_time || "Active"}</td>
                             <td>{session.duration || 0}s</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 )}
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

 calibrationGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginBottom: "24px",
},

calibrationItem: {
  background: "white",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
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


  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 12px",
  },

Chartcard: {
  background: "white",
  borderRadius: "24px",
  padding: "24px",
  marginTop: "24px",
  minHeight: "420px"
},

sessionRow: {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #eee",
},

insightCard: {
  marginTop: "20px",
  padding: "16px",
  borderRadius: "12px",
  background: "#fff8e8",
  border: "1px solid #f0d9a7",
  color: "#8a5d2f",
},
};