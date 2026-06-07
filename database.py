def init_db():
    import sqlite3

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)
    # Calibration data
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS calibration_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
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
        user_id INTEGER,
        start_time DATETIME,
        end_time DATETIME,
        duration INTEGER
    )
    """)

    # Fatigue events
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS fatigue_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        session_id INTEGER,
        fatigue TEXT,
        severity TEXT,
        timestamp DATETIME 
    )
    """)

    conn.commit()
    conn.close()

from datetime import datetime
import sqlite3

def end_session(session_id):

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT start_time
        FROM study_sessions
        WHERE id=?
    """, (session_id,))

    row = cursor.fetchone()

    if row:

        start_time = datetime.strptime(
            row[0],
            "%Y-%m-%d %H:%M:%S"
        )

        end_time = datetime.now()

        duration = int(
            (end_time - start_time).total_seconds()
        )

        cursor.execute("""
            UPDATE study_sessions
            SET end_time=?, duration=?
            WHERE id=?
        """,
        (
            end_time.strftime("%Y-%m-%d %H:%M:%S"),
            duration,
            session_id
        ))

        conn.commit()

    conn.close()