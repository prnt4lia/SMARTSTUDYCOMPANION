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


  