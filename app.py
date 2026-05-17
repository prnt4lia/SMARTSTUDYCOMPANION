from datetime import datetime

import cv2
from cv2 import data
from flask import Flask, Response, json, jsonify, render_template, redirect, request
from flask_cors import CORS
from adaptive_recommender import AdaptiveRecommender
from database import init_db
import sqlite3
from fatigue_detection import FatigueDetector
from recommendation_engine import RecommendationEngine
from collections import deque
import time

fatigue_buffer = deque(maxlen=10)
last_saved = None
last_trigger_time = 0
cooldown = 5  # seconds
calibrating = False
ear_list = []
mar_list = []
calibration_start_time = None
calibration_duration = 15
last_calibration_result = None
detection_running = False
calibration_max_frames = 300

app = Flask(__name__)
CORS(app)
init_db()


def end_session(session_id):
    import sqlite3

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    end_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute(
        """
        UPDATE study_sessions
        SET end_time = ?,
            duration = (strftime('%s', ?) - strftime('%s', start_time))
        WHERE id = ?
        """,
        (end_time, end_time, session_id),
    )

    conn.commit()
    conn.close()


def start_session():
    import sqlite3

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    start_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute(
        """
        INSERT INTO study_sessions (start_time)
        VALUES (?)
        """,
        (start_time,),
    )

    conn.commit()
    session_id = cursor.lastrowid
    conn.close()

    return session_id


def save_fatigue_event(session_id, fatigue, severity):
    import sqlite3

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO fatigue_events (session_id, fatigue, severity)
        VALUES (?, ?, ?)
        """,
        (session_id, fatigue, severity),
    )

    conn.commit()
    conn.close()


current_session_id = start_session()

# Initialize detector
detector = FatigueDetector()
# Initialize recommendation engine
recommender = RecommendationEngine()
# Initialize adaptive recommender
#ai_recommender = AdaptiveRecommender()
# Start webcam
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

# Store fatigue status (shared with API)
fatigue_data = {
    "fatigue": None,
    "severity": None,
}


def generate_frames():

    global fatigue_data, last_saved, current_session_id, last_trigger_time,  calibration_start_time, calibration_duration, last_calibration_result,detector
    

    while True:
        success, frame = cap.read()
        if not success:
            print("Camera frame not captured")
            continue

        global detection_running
        global calibrating, ear_list, mar_list

        # Default values
        fatigue = None
        severity = None
        ear = 0
        mar = 0

        if calibrating:
            frame, fatigue, severity, ear, mar = detector.process_frame(frame, detect_fatigue=False)

        elif detection_running:
            frame, fatigue, severity, ear, mar = detector.process_frame(frame, detect_fatigue=True)

        # Idle mode
        else:
            fatigue = None
            severity = None
            ear = 0
            mar = 0

        if calibrating and calibration_start_time is not None:
            ear_list.append(ear)
            mar_list.append(mar)

            elapsed = time.time() - calibration_start_time

            if (
                elapsed >= calibration_duration 
                #(len(ear_list) >= calibration_max_frames and len(mar_list) >= calibration_max_frames) 
                ):
                print("✅ Calibration completed automatically")

                calibrating = False

                import numpy as np

                ear_mean = np.mean(ear_list)
                ear_std = np.std(ear_list)
                mar_mean = np.mean(mar_list)
                mar_std = np.std(mar_list)

               

                data = {
                        "status": "completed",
                        "ear_mean": float(ear_mean),
                        "ear_std": float(ear_std),
                        "mar_mean": float(mar_mean),
                        "mar_std": float(mar_std)
            }

                with open("data/calibration_data.json", "w") as f:
                    json.dump(data, f)

                from calibration import save_calibration
                save_calibration(ear_mean, ear_std, mar_mean, mar_std)
                                

                detector = FatigueDetector()

                # SAVE FOR FRONTEND
                global last_calibration_result
                last_calibration_result = data

                print("✅ Calibration saved to database")

       

        # Add to buffer
        fatigue_buffer.append((fatigue, severity))

        # Count occurrences
        counts = {}
        for f, s in fatigue_buffer:
           key = (f, s)
           counts[key] = counts.get(key, 0) + 1

        # Get most frequent
        stable = max(counts, key=counts.get)

        # Apply threshold
        if counts[stable] >= 6:
           stable_fatigue, stable_severity = stable
        else:
           stable_fatigue, stable_severity = None, None

        #  Use STABLE values
        fatigue_data["fatigue"] = stable_fatigue
        fatigue_data["severity"] = stable_severity


        # SAVE
        current_time = time.time()

        if stable_fatigue is not None:
            current = stable_fatigue + str(stable_severity)
        else:
            current = None

        if (current != last_saved and 
                current_time - last_trigger_time > cooldown):

                save_fatigue_event(current_session_id,
                                   stable_fatigue,
                                   stable_severity)

                last_saved = current
                last_trigger_time = current_time

        # Encode frame
        _, buffer = cv2.imencode(".jpg", frame)

        frame_bytes = buffer.tobytes()
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
        )


@app.route("/api/register", methods=["POST"])
def register():

    data = request.json

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Missing username or password"
        })

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    try:

        cursor.execute("""
        INSERT INTO users (username, password)
        VALUES (?, ?)
        """, (username, password))

        conn.commit()

        return jsonify({
            "success": True,
            "message": "User registered successfully"
        })

    except sqlite3.IntegrityError:

        return jsonify({
            "success": False,
            "message": "Username already exists"
        })

    finally:
        conn.close()


@app.route("/api/login", methods=["POST"])
def login():

    data = request.json

    username = data.get("username")
    password = data.get("password")

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM users
    WHERE username=? AND password=?
    """, (username, password))

    user = cursor.fetchone()

    conn.close()

    if user:

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user_id": user[0],
            "username": user[1]
        })

    else:

        return jsonify({
            "success": False,
            "message": "Invalid username or password"
        })
    
    
@app.route('/api/start_calibration')
def start_calibration():
    global calibrating, ear_list, mar_list,calibration_start_time

    calibrating = True
    ear_list = []
    mar_list = []
    calibration_start_time = time.time()

    return {"status": "started"}

@app.route('/api/calibration_status')
def calibration_status():
    
    global last_calibration_result
    last_calibration_result = None
    
    global calibrating

    if calibrating:
        return {
            "status": "running"
        }

    else:
        return {
            "status": "completed"
        }
    

@app.route('/api/stop_calibration')
def stop_calibration():

    global calibrating
    global last_calibration_result

    calibrating = False

    if last_calibration_result:
        return last_calibration_result

    return {"status": "pending"}
    
#auto run
@app.route('/api/calibration_result')
def calibration_result():
    global last_calibration_result

    if last_calibration_result:
        return last_calibration_result
    else:
        return {"status": "pending"}

@app.route('/')
def api_root():
    return jsonify({
        "message": "Smart Study Companion API running",
        "endpoints": {
            "/video_feed": "Live video stream with fatigue detection",
            "/api/fatigue": "Current fatigue status and recommendation",
            "/api/feedback": "Submit feedback on recommendations (POST)",
            "/api/stats": "Study session statistics",
            "/api/start_calibration": "Start calibration process",
            "/api/stop_calibration": "Stop calibration process and save data",
            "/api/calibration_result": "Get latest calibration results"
        }
    })

@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )


@app.route("/api/fatigue")
def fatigue_status():
    fatigue = fatigue_data["fatigue"]
    severity = fatigue_data["severity"]

    recommendation = recommender.get_recommendation(fatigue, severity)

    return jsonify(
        {
            "fatigue": fatigue,
            "severity": severity,
            "recommendation": recommendation,
        }
    )

@app.route('/api/start_detection')
def start_detection():
    global detection_running
    detection_running = True
    return {"status": "started"}

@app.route('/api/stop_detection')
def stop_detection():
    global detection_running
    detection_running = False
    return {"status": "stopped"}



@app.route('/api/stats')
def stats():
    import sqlite3

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # Study duration (latest session)
    cursor.execute("""
    SELECT duration FROM study_sessions
    ORDER BY id DESC LIMIT 1
    """)
    result = cursor.fetchone()
    duration = result[0] if result and result[0] else 0

    # Fatigue count
    cursor.execute("SELECT COUNT(*) FROM fatigue_events")
    fatigue_count = cursor.fetchone()[0]

    # Fatigue type distribution
    cursor.execute("""
    SELECT fatigue, COUNT(*) FROM fatigue_events
    GROUP BY fatigue
    """)
    data = cursor.fetchall()

    eye = 0
    mental = 0

    for row in data:
        if row[0] == "eye_fatigue":
            eye = row[1]
        elif row[0] == "mental_fatigue":
            mental = row[1]

    conn.close()

    return {
        "duration": duration,
        "fatigue_count": fatigue_count,
        "eye": eye,
        "mental": mental
    }

if __name__ == "__main__":
    try:
        app.run(debug=True, use_reloader=False)
    finally:
        if current_session_id:
            end_session(current_session_id)
