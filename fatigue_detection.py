import cv2
import dlib
import imutils
import json
import numpy as np
from imutils import face_utils
from scipy.spatial import distance
import sqlite3


class FatigueDetector:
    def __init__(self, user_id=None, use_calibration=True):
        # Load calibration ONLY if requested
        if use_calibration:
            conn = sqlite3.connect("database.db")
            cursor = conn.cursor()

            cursor.execute("""
            SELECT ear_mean, ear_std, mar_mean, mar_std
            FROM calibration_data
            WHERE user_id=?
            ORDER BY id DESC
            LIMIT 1
            """, (user_id,))

            result = cursor.fetchone()
            conn.close()
        else:
            result = None

        if result:
            ear_mean, ear_std, mar_mean, mar_std = result

            print("✅ Calibration loaded from database")
        else:
            print("⚠ No calibration found. Using defaults")
            ear_mean = 0.25
            ear_std = 0.05
            mar_mean = 0.6
            mar_std = 0.1

        # Threshold parameters
        alpha = 0.5
        self.global_ear = 0.25
        self.global_mar = 0.6

        self.ear_thresh = alpha * self.global_ear + (1 - alpha) * (ear_mean - 2 * ear_std)
        self.mar_thresh = alpha * self.global_mar + (1 - alpha) * (mar_mean + 2.5 * mar_std)

        print("===== CALIBRATION LOADED =====")
        print("EAR mean:", ear_mean)
        print("EAR std:", ear_std)
        print("MAR mean:", mar_mean)
        print("MAR std:", mar_std)
        print("EAR Threshold:", self.ear_thresh)
        print("MAR Threshold:", self.mar_thresh)
        print("==============================")

        # Frame counters
        self.eye_counter = 0
        self.yawn_counter = 0

        # Threshold frames
        self.eye_low_frames = 30
        self.eye_high_frames = 60
        self.yawn_low_frames = 30
        self.yawn_high_frames = 60

        self.ear_history = []
        self.mar_history = []

        # Load models
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor("models/shape_predictor_68_face_landmarks.dat")

        # Landmark indices
        (self.lStart, self.lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
        (self.rStart, self.rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]
        (self.mStart, self.mEnd) = face_utils.FACIAL_LANDMARKS_IDXS["mouth"]

    # ---------- HELPER FUNCTIONS ----------
    def eye_aspect_ratio(self, eye):
        A = distance.euclidean(eye[1], eye[5])
        B = distance.euclidean(eye[2], eye[4])
        C = distance.euclidean(eye[0], eye[3])
        return (A + B) / (2.0 * C)

    def mouth_aspect_ratio(self, mouth):
        A = distance.euclidean(mouth[13], mouth[19])
        B = distance.euclidean(mouth[14], mouth[18])
        C = distance.euclidean(mouth[15], mouth[17])
        D = distance.euclidean(mouth[12], mouth[16])
        return (A + B + C) / (2.0 * D)

    # ---------- MAIN PROCESS FUNCTION ----------
    def process_frame(self, frame, detect_fatigue=True):
        frame = imutils.resize(frame, width=450)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        warning_message = None

        fatigue_type = None
        severity = None

        ear = 1.0
        mar = 0.0
        ear_avg = ear
        mar_avg = mar

        faces = self.detector(gray)

        # MULTIPLE FACE CHECK
        if len(faces) > 1:
            warning_message = "Only one face allowed"

        

            return frame, None, None, ear, mar, warning_message

        #NO FACE CHECK
        if len(faces) == 0:
            warning_message = "No face detected"

            self.eye_counter = 0
            self.yawn_counter = 0

         

            return frame, None, None, ear, mar, warning_message
        
        

        for face in faces:
            shape = self.predictor(gray, face)
            shape = face_utils.shape_to_np(shape)

            leftEye = shape[self.lStart:self.lEnd]
            rightEye = shape[self.rStart:self.rEnd]
            mouth = shape[self.mStart:self.mEnd]

            ear = (self.eye_aspect_ratio(leftEye) +
                   self.eye_aspect_ratio(rightEye)) / 2.0
            mar = self.mouth_aspect_ratio(mouth)

            if ear < 0.12:
                warning_message = "Please keep eyes visible"

           

            #use for debugging
            # print(f"EAR: {ear:.3f} | MAR: {mar:.3f}")

            # -------- SMOOTHING --------
            self.ear_history.append(ear)
            self.mar_history.append(mar)

            if len(self.ear_history) > 10:
                self.ear_history.pop(0)

            if len(self.mar_history) > 10:
                self.mar_history.pop(0)

            ear_avg = sum(self.ear_history) / len(self.ear_history)
            mar_avg = sum(self.mar_history) / len(self.mar_history)

            if not detect_fatigue:
                # Draw contours (optional UI overlay)
                cv2.drawContours(frame, [cv2.convexHull(leftEye)], -1, (0, 255, 0), 1)
                cv2.drawContours(frame, [cv2.convexHull(rightEye)], -1, (0, 255, 0), 1)
                cv2.drawContours(frame, [cv2.convexHull(mouth)], -1, (255, 0, 0), 1)
        

        if detect_fatigue:
            # ---------- EYE FATIGUE ----------
            if ear_avg < self.ear_thresh:
                self.eye_counter += 1
                print(f"⚠ Low EAR detected: {ear_avg:.3f} (Threshold: {self.ear_thresh:.3f})")

                if self.eye_counter >= self.eye_high_frames:
                    fatigue_type = "eye_fatigue"
                    severity = "high"

                elif self.eye_counter >= self.eye_low_frames:
                    fatigue_type = "eye_fatigue"
                    severity = "low"

            else:
                self.eye_counter = max(0, self.eye_counter - 1)

            # ---------- MENTAL FATIGUE ----------
            if mar_avg > self.mar_thresh:
                self.yawn_counter += 1
                print(f"⚠ High MAR detected: {mar_avg:.3f} (Threshold: {self.mar_thresh:.3f})")
                
                if self.yawn_counter >= self.yawn_high_frames:
                    fatigue_type = "mental_fatigue"
                    severity = "high"

                elif self.yawn_counter >= self.yawn_low_frames:
                    fatigue_type = "mental_fatigue"
                    severity = "low"

            else:
                self.yawn_counter = max(0, self.yawn_counter - 1)

        if warning_message:
            cv2.putText(
                frame,
                warning_message,
                (20, 80),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 0, 255),
                2
            )

        return frame, fatigue_type, severity, ear, mar, warning_message
