import json
import random

class AdaptiveRecommender:

    def __init__(self, history_file="data/user_history.json"):
        self.history_file = history_file
        self.history = self.load_history()

    def load_history(self):
        try:
            with open(self.history_file, "r") as f:
                return json.load(f)
        except:
            return []

    def save_history(self):
        with open(self.history_file, "w") as f:
            json.dump(self.history, f, indent=4)

    def get_recommendation(self, fatigue, severity):
        # Default options
        options = {
            ("eye_fatigue", "low"): [
                ("Blinking exercise", "30–60 sec"),
                ("Look away from screen", "1 min")
            ],
            ("eye_fatigue", "high"): [
                ("Take short break", "5 min"),
                ("Reduce brightness", "5 min")
            ],
            ("mental_fatigue", "low"): [
                ("Stretch", "2 min"),
                ("Drink water", "2 min")
            ],
            ("mental_fatigue", "high"): [
                ("Take a walk", "5–10 min"),
                ("Breathing exercise", "5 min")
            ]
        }

        key = (fatigue, severity)

        if key not in options:
            return {"activity": "Keep studying", "duration": "-"}

        # AI Logic: prefer actions user followed before
        past_success = [
            h["recommended"]
            for h in self.history
            if h["fatigue"] == fatigue and
               h["severity"] == severity and
               h["user_followed"]
        ]

        if past_success:
            best = random.choice(past_success)
            return {"activity": best, "duration": "Adaptive"}

        # fallback random
        activity, duration = random.choice(options[key])
        return {"activity": activity, "duration": duration}

    def update_feedback(self, fatigue, severity, recommendation, followed):
        self.history.append({
            "fatigue": fatigue,
            "severity": severity,
            "recommended": recommendation,
            "user_followed": followed
        })
        self.save_history()