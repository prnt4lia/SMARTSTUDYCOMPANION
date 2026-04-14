import cv2
import dlib
import imutils
import json
import numpy as np
from imutils import face_utils
from scipy.spatial import distance

def save_calibration(ear_mean, ear_std, mar_mean, mar_std):
    import sqlite3

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO calibration_data (ear_mean, ear_std, mar_mean, mar_std)
    VALUES (?, ?, ?, ?)
    """, (ear_mean, ear_std, mar_mean, mar_std))

    conn.commit()
    conn.close()

class Calibrator:
    def __init__(self, output_file="data/calibration_data.json"):
        self.output_file = output_file

        # Load models
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor("models/shape_predictor_68_face_landmarks.dat")

        # Landmark indices
        (self.lStart, self.lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
        (self.rStart, self.rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]
        (self.mStart, self.mEnd) = face_utils.FACIAL_LANDMARKS_IDXS["mouth"]

        # Data storage
        self.ear_values = []
        self.mar_values = []

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

    # ---------- MAIN CALIBRATION ----------
    def run(self, frames=200):
        cap = cv2.VideoCapture(0)

        print("Calibration started... keep eyes open and mouth relaxed.")

        for i in range(frames):
            ret, frame = cap.read()
            if not ret:
                continue

            frame = imutils.resize(frame, width=450)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            faces = self.detector(gray)

            for face in faces:
                shape = self.predictor(gray, face)
                shape = face_utils.shape_to_np(shape)

                leftEye = shape[self.lStart:self.lEnd]
                rightEye = shape[self.rStart:self.rEnd]
                mouth = shape[self.mStart:self.mEnd]

                ear = (self.eye_aspect_ratio(leftEye) +
                       self.eye_aspect_ratio(rightEye)) / 2
                mar = self.mouth_aspect_ratio(mouth)

                self.ear_values.append(ear)
                self.mar_values.append(mar)

                # Optional: draw landmarks
                cv2.drawContours(frame, [cv2.convexHull(leftEye)], -1, (0, 255, 0), 1)
                cv2.drawContours(frame, [cv2.convexHull(rightEye)], -1, (0, 255, 0), 1)
                cv2.drawContours(frame, [cv2.convexHull(mouth)], -1, (255, 0, 0), 1)

            # UI feedback
            cv2.putText(frame, f"Calibrating... {i+1}/{frames}",
                        (10, 30), cv2.FONT_HERSHEY_SIMPLEX,
                        0.7, (255, 255, 0), 2)

            cv2.imshow("Calibration", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

        return self.save_results()

    # ---------- SAVE RESULTS ----------
    def save_results(self):
        ear_mean = np.mean(self.ear_values)
        ear_std = np.std(self.ear_values)

        mar_mean = np.mean(self.mar_values)
        mar_std = np.std(self.mar_values)

        data = {
            "ear_mean": float(ear_mean),
            "ear_std": float(ear_std),
            "mar_mean": float(mar_mean),
            "mar_std": float(mar_std)
        }

        with open(self.output_file, "w") as f:
            json.dump(data, f)

        # Also save to database
        save_calibration(ear_mean, ear_std, mar_mean, mar_std)

        print("Calibration complete.")
        print(data)

        return data


# ---------- RUN SCRIPT ----------
if __name__ == "__main__":
    calibrator = Calibrator()
    calibrator.run()