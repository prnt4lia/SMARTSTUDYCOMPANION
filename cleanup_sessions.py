import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("""
DELETE FROM study_sessions
WHERE end_time IS NULL
  OR duration IS NULL
""")

print(f"{cursor.rowcount} rows deleted.")

conn.commit()
conn.close()