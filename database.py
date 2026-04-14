def init_db():
    import sqlite3

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # Calibration data
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS calibration_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ear_mean REAL,
        ear_std REAL,
        mar_mean REAL,
        mar_std REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Study sessions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS study_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time DATETIME,
        end_time DATETIME,
        duration INTEGER
    )
    """)

    # Fatigue events
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS fatigue_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER,
        fatigue TEXT,
        severity TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()