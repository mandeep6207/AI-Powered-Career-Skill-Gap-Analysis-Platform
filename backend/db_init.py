import sqlite3, os
BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, 'database.db')
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT UNIQUE, password_hash TEXT, token TEXT, target_role TEXT)''')
cur.execute('''CREATE TABLE IF NOT EXISTS assessments (id INTEGER PRIMARY KEY, user_id INTEGER, date TEXT, target_role TEXT, match_score INTEGER, missing_skills TEXT, details TEXT)''')
conn.commit(); conn.close()
print('Initialized database at', DB_PATH)
