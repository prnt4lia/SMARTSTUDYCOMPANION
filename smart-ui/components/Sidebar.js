"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Activity,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      label: "Fatigue Detector",
      icon: Activity,
      path: "/fatigue_detector",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      label: "Calibration",
      icon: Settings,
      path: "/calibration",
    },
  ];

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>
        📚 SSC
      </h2>

      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            style={{
              ...styles.navButton,
              backgroundColor:
                pathname === item.path
                  ? "#b38758"
                  : "transparent",
              color:
                pathname === item.path
                  ? "white"
                  : "#5a4634",
            }}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}

      <button
        onClick={logout}
        style={styles.logout}
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    height: "100vh",
    background: "#f8f4ef",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    borderRight: "1px solid #e5d7c5",
    position: "fixed",
    left: 0,
    top: 0,
  },

  logo: {
    marginBottom: "30px",
    color: "#8b5e34",
  },

  navButton: {
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontSize: "15px",
  },

  logout: {
    marginTop: "auto",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
};