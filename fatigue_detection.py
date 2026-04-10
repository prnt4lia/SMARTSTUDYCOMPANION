import cv2
import dlib
import imutils
import json
import numpy as np
from imutils import face_utils
from scipy.spatial import distance


class FatigueDetector:
    def __init__(self, calibration_file="data/calibration_data.json"):
        # Load calibration data
        with open(calibration_file) as f:
            data = json.load(f)

        # Threshold parameters
        alpha = 0.5
        self.global_ear = 0.25
        self.global_mar = 0.6

        self.ear_thresh = alpha * self.global_ear + (1 - alpha) * (data["ear_mean"] - 2 * data["ear_std"])
        self.mar_thresh = alpha * self.global_mar + (1 - alpha) * (data["mar_mean"] + 2.5 * data["mar_std"])

        # Frame counters
        self.eye_counter = 0
        self.yawn_counter = 0

        # Threshold frames
        self.eye_low_frames = 20
        self.eye_high_frames = 40
        self.yawn_low_frames = 15
        self.yawn_high_frames = 30

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
    def process_frame(self, frame):
        frame = imutils.resize(frame, width=450)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        fatigue_type = None
        severity = None

        ear = 1.0
        mar = 0.0

        faces = self.detector(gray)

        for face in faces:
            shape = self.predictor(gray, face)
            shape = face_utils.shape_to_np(shape)

            leftEye = shape[self.lStart:self.lEnd]
            rightEye = shape[self.rStart:self.rEnd]
            mouth = shape[self.mStart:self.mEnd]

            ear = (self.eye_aspect_ratio(leftEye) +
                   self.eye_aspect_ratio(rightEye)) / 2.0
            mar = self.mouth_aspect_ratio(mouth)

            # Draw contours (optional UI overlay)
            cv2.drawContours(frame, [cv2.convexHull(leftEye)], -1, (0, 255, 0), 1)
            cv2.drawContours(frame, [cv2.convexHull(rightEye)], -1, (0, 255, 0), 1)
            cv2.drawContours(frame, [cv2.convexHull(mouth)], -1, (255, 0, 0), 1)

        # ---------- EYE FATIGUE ----------
        if ear < self.ear_thresh:
            self.eye_counter += 1

            if self.eye_counter >= self.eye_high_frames:
                fatigue_type = "eye_fatigue"
                severity = "high"

            elif self.eye_counter >= self.eye_low_frames:
                fatigue_type = "eye_fatigue"
                severity = "low"

        else:
            self.eye_counter = max(0, self.eye_counter - 1)

        # ---------- MENTAL FATIGUE ----------
        if mar > self.mar_thresh:
            self.yawn_counter += 1

            if self.yawn_counter >= self.yawn_high_frames:
                fatigue_type = "mental_fatigue"
                severity = "high"

            elif self.yawn_counter >= self.yawn_low_frames:
                fatigue_type = "mental_fatigue"
                severity = "low"

        else:
            self.yawn_counter = max(0, self.yawn_counter - 1)

        return frame, fatigue_type, severity