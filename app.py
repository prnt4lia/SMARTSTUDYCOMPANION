from flask import Flask, render_template, Response, jsonify
import cv2
from fatigue_detection import FatigueDetector
from recommendation_engine import RecommendationEngine
from adaptive_recommender import AdaptiveRecommender


app = Flask(__name__)

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
    "severity": None
}


# 🎥 Generate video frames
def generate_frames():
    cap = cv2.VideoCapture(0)
    global fatigue_data

    while True:
        success, frame = cap.read()
        if not success:
            break

        # Process frame using your detector
        frame, fatigue, severity = detector.process_frame(frame)

        # Update global fatigue data
        fatigue_data["fatigue"] = fatigue
        fatigue_data["severity"] = severity

        # Encode frame to JPEG
        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        # Stream frame
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


# 🏠 Main Dashboard Page
@app.route('/')
def index():
    return render_template('dashboard.html')


# 🎥 Video Feed Route
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


# 📊 Fatigue Status API
@app.route('/fatigue_status')
def fatigue_status():
    fatigue = fatigue_data["fatigue"]
    severity = fatigue_data["severity"]

    recommendation = ai_recommender.get_recommendation(fatigue, severity)

    return jsonify({
        "fatigue": fatigue,
        "severity": severity,
        "recommendation": recommendation
    })
#Feedback system for user interactions with recommendations
@app.route('/feedback', methods=['POST'])
def feedback():
    from flask import request

    data = request.json

    ai_recommender.update_feedback(
        data["fatigue"],
        data["severity"],
        data["recommendation"],
        data["followed"]
    )

    return {"status": "success"}

# 🚀 Run App
if __name__ == "__main__":
    app.run(debug=True)