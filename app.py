from datetime import datetime

import cv2
from flask import Flask, Response, jsonify, render_template

from adaptive_recommender import AdaptiveRecommender
from database import init_db
from fatigue_detection import FatigueDetector
from recommendation_engine import RecommendationEngine


session_started_at = datetime.now()
current_session_id = None
last_saved = None

app = Flask(__name__)
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
ai_recommender = AdaptiveRecommender()
# Start webcam
cap = cv2.VideoCapture(0)

# Store fatigue status (shared with API)
fatigue_data = {
    "fatigue": None,
    "severity": None,
}


def generate_frames():
    local_cap = cv2.VideoCapture(0)

    global fatigue_data, last_saved, current_session_id

    while True:
        success, frame = local_cap.read()
        if not success:
            continue

        frame, fatigue, severity = detector.process_frame(frame)

        fatigue_data["fatigue"] = fatigue
        fatigue_data["severity"] = severity

        if fatigue is not None:
            current = fatigue + str(severity)

            if current != last_saved:
                save_fatigue_event(current_session_id, fatigue, severity)
                last_saved = current

        _, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
        )


@app.route("/")
def index():
    return render_template("dashboard.html")


@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )


@app.route("/fatigue_status")
def fatigue_status():
    fatigue = fatigue_data["fatigue"]
    severity = fatigue_data["severity"]

    recommendation = ai_recommender.get_recommendation(fatigue, severity)

    return jsonify(
        {
            "fatigue": fatigue,
            "severity": severity,
            "recommendation": recommendation,
        }
    )


@app.route("/feedback", methods=["POST"])
def feedback():
    from flask import request

    data = request.json

    ai_recommender.update_feedback(
        data["fatigue"],
        data["severity"],
        data["recommendation"],
        data["followed"],
    )

    return {"status": "success"}


if __name__ == "__main__":
    try:
        app.run(debug=True)
    finally:
        if current_session_id:
            end_session(current_session_id)
