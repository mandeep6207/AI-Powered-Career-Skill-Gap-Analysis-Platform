from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3, os, json, datetime, secrets, time
from werkzeug.security import generate_password_hash, check_password_hash
from utils.recommender import analyze

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, 'database.db')

# Rate limiter (simple in-memory)
rate_limit_store = {}

def check_rate_limit(ip, limit=100, window=60):
    key = f'{ip}:{int(time.time() // window)}'
    count = rate_limit_store.get(key, 0)
    if count >= limit:
        return False
    rate_limit_store[key] = count + 1
    return True

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT UNIQUE, password_hash TEXT, token TEXT, target_role TEXT)''')
    cur.execute('''CREATE TABLE IF NOT EXISTS assessments (id INTEGER PRIMARY KEY, user_id INTEGER, date TEXT, target_role TEXT, match_score INTEGER, missing_skills TEXT, details TEXT)''')
    conn.commit()
    conn.close()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:5173"]}})

# Add security headers middleware
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

# Rate limiting middleware
@app.before_request
def before_request():
    ip = request.remote_addr
    if not check_rate_limit(ip):
        return jsonify({'error': 'Rate limit exceeded'}), 429

init_db()

def get_user_by_token(token):
    if not token: return None
    conn = get_db(); cur = conn.cursor()
    cur.execute('SELECT * FROM users WHERE token=?', (token,))
    row = cur.fetchone(); conn.close()
    return row

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not (username and email and password): return jsonify({'error':'missing'}),400
    pwdhash = generate_password_hash(password)
    conn = get_db(); cur = conn.cursor()
    try:
        cur.execute('INSERT INTO users (username,email,password_hash) VALUES (?,?,?)', (username,email,pwdhash))
        conn.commit()
    except Exception as e:
        conn.close(); return jsonify({'error':'user exists'}),400
    conn.close()
    return jsonify({'status':'ok'})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    conn = get_db(); cur = conn.cursor()
    cur.execute('SELECT * FROM users WHERE email=?', (email,))
    user = cur.fetchone()
    if not user or not check_password_hash(user['password_hash'], password):
        conn.close(); return jsonify({'error':'invalid'}),401
    token = secrets.token_hex(24)
    cur.execute('UPDATE users SET token=? WHERE id=?', (token, user['id']))
    conn.commit()
    conn.close()
    return jsonify({'token': token, 'username': user['username'], 'email': user['email']})

def auth_required(f):
    def wrapper(*args, **kwargs):
        auth = request.headers.get('Authorization','')
        token = auth.replace('Bearer ','').strip()
        user = get_user_by_token(token)
        if not user:
            return jsonify({'error':'unauthenticated'}),401
        request.user = user
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

@app.route('/analyze', methods=['POST'])
@auth_required
def analyze_route():
    data = request.json
    target_role = data.get('target_role')
    current_skills = data.get('current_skills','')
    proficiency = data.get('proficiency','Intermediate')
    weekly_hours = int(data.get('weekly_hours',5))
    # parse skills
    skills = [s.strip() for s in current_skills.split(',') if s.strip()]
    result = analyze(target_role, skills, proficiency, weekly_hours)

    conn = get_db(); cur = conn.cursor()
    cur.execute('INSERT INTO assessments (user_id,date,target_role,match_score,missing_skills,details) VALUES (?,?,?,?,?,?)',
                (request.user['id'], datetime.datetime.utcnow().isoformat(), target_role, result['match_percentage'], ','.join(result['missing_skills']), json.dumps(result)))
    conn.commit(); conn.close()

    return jsonify(result)

@app.route('/history', methods=['GET'])
@auth_required
def history():
    conn = get_db(); cur = conn.cursor()
    cur.execute('SELECT * FROM assessments WHERE user_id=? ORDER BY id DESC', (request.user['id'],))
    rows = cur.fetchall(); conn.close()
    out = []
    for r in rows:
        out.append({'id': r['id'], 'date': r['date'], 'target_role': r['target_role'], 'match_score': r['match_score'], 'missing_skills': r['missing_skills'], 'details': json.loads(r['details'])})
    return jsonify(out)

@app.route('/profile', methods=['GET'])
@auth_required
def profile():
    user = request.user
    conn = get_db(); cur = conn.cursor()
    cur.execute('SELECT * FROM assessments WHERE user_id=? ORDER BY id DESC LIMIT 1', (user['id'],))
    latest = cur.fetchone()
    conn.close()
    latest_match = latest['match_score'] if latest else None
    missing_count = len(latest['missing_skills'].split(',')) if latest and latest['missing_skills'] else 0
    return jsonify({'username': user['username'], 'email': user['email'], 'target_role': user['target_role'], 'latest_match': latest_match, 'missing_count': missing_count})


@app.route('/logout', methods=['POST'])
@auth_required
def logout():
    conn = get_db(); cur = conn.cursor()
    cur.execute('UPDATE users SET token=NULL WHERE id=?', (request.user['id'],))
    conn.commit(); conn.close()
    return jsonify({'status':'logged_out'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
