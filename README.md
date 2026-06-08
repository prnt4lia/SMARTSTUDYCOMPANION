# Smart Study Companion

A real-time fatigue detection and break recommendation system that monitors students during study sessions using webcam-based facial analysis. The system detects eye fatigue and yawning using Eye Aspect Ratio (EAR) and Mouth Aspect Ratio (MAR), applies adaptive thresholding for personalized fatigue detection, and provides rule-based break recommendations.

## Features

* User Authentication (Login & Registration)
* Personalized Calibration (EAR & MAR Thresholds)
* Real-Time Fatigue Detection
* Eye Fatigue and Mental Fatigue Monitoring
* Rule-Based Activity Recommendations
* Dashboard Analytics and Session Tracking
* Fatigue Event Logging
* Real-Time Alerts and Notifications

---

## Technologies Used

### Frontend

* Next.js
* React.js
* JavaScript

### Backend

* Flask
* Python

### Computer Vision

* OpenCV
* dlib
* imutils
* NumPy
* SciPy

### Database

* SQLite

---

## System Requirements

### Hardware

* Webcam
* Minimum 4GB RAM
* Intel Core i3 or equivalent processor

### Software

* Python 3.10 or later
* Node.js 18 or later
* npm

---

## Installation

### 1. Clone the Repository

git clone <repository-url>
cd SMART STUDY COMPANION

### 2. Create Python Virtual Environment


python -m venv .venv


Activate the virtual environment:

**Windows**

.venv\Scripts\activate


**Linux / macOS**

source .venv/bin/activate

---

### 3. Install Python Dependencies


pip install -r requirements.txt

### 4. Install Frontend Dependencies

Navigate to the Next.js project folder:

cd smart-ui


Install required packages:

npm install


## Running the Application

### Step 1: Start Flask Backend

From the project root directory:

python app.py


The Flask API server will run on:
http://127.0.0.1:5000


---

### Step 2: Start Next.js Frontend

Open a new terminal:


cd smart-ui
npm run dev


The web application will run on:


http://localhost:3000

---

## Usage

1. Register a new account or login using demo account.
    Username:userpriya
    Password: Natalia!123
2. Login to the system.
3. Perform calibration to generate personalized EAR and MAR thresholds.
4. Start a study session.
5. Allow webcam access.
6. Monitor fatigue in real time.
7. Receive alerts and break recommendations when fatigue is detected.
8. View session statistics and fatigue history in the analytics dashboard.

---

## Project Structure

SMART-STUDY-COMPANION/
│
├── app.py
├── fatigue_detection.py
├── calibration.py
├── recommendation_engine.py
├── database.py
├── database.db
├── requirements.txt
│
├── smart-ui/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
│
└── README.md

---

## Authors

Priya Natalia Raj
Faculty of Computer Science and Information Technology
Universiti Malaysia Sarawak (UNIMAS)

Supervisor:
Dr Cynthia Kon Mui Lan
Faculty of Computer Science and Information Technology
Universiti Malaysia Sarawak (UNIMAS)
---

## License

This project was developed as part of a Final Year Project (FYP) at Universiti Malaysia Sarawak (UNIMAS).
