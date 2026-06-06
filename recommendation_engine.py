class RecommendationEngine:

    def get_recommendation(self, fatigue, severity):
        if fatigue == "eye_fatigue" and severity == "low":
            return {
                "rule": "R1",
                "activity": "Eye rest / blinking exercise",
                "duration": "30–60 seconds"
            }

        elif fatigue == "eye_fatigue" and severity == "high":
            return {
                "rule": "R2",
                "activity": "Short break, reduce screen brightness",
                "duration": "5 minutes"
            }

        elif fatigue == "mental_fatigue" and severity == "low":
            return {
                "rule": "R3",
                "activity": "Light stretching / hydration",
                "duration": "2–3 minutes"
            }

        elif fatigue == "mental_fatigue" and severity == "high":
            return {
                "rule": "R4",
                "activity": "Short walk or breathing exercise",
                "duration": "5–10 minutes"
            }
        
        else:
            return {
                "rule": None,
                "activity": "Keep studying",
                "duration": None
            }