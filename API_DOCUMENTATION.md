# API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require an `Authorization` header:
```
Authorization: Bearer {token}
```

Tokens are 48-character hexadecimal strings returned from login/signup.

---

## Endpoints

### 1. User Authentication

#### POST /signup
Create a new user account.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "token": "a1b2c3d4e5f6...",
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Errors:**
- 400: Missing fields or invalid email format
- 409: Email already exists

---

#### POST /login
Authenticate user and get token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "token": "a1b2c3d4e5f6...",
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Errors:**
- 400: Missing email or password
- 401: Invalid credentials

---

#### POST /logout
Invalidate current token (requires auth).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "logged out"
}
```

---

### 2. Skill Assessment

#### POST /analyze
Analyze skill gaps and generate recommendations.

**Request:**
```json
{
  "target_role": "Data Scientist",
  "current_skills": "Python, SQL, Statistics",
  "proficiency": "Intermediate",
  "weekly_hours": 10
}
```

**Response (200):**
```json
{
  "match_percentage": 65,
  "found_skills": ["Python", "SQL"],
  "missing_skills": ["Machine Learning", "TensorFlow", "Big Data"],
  "estimated_weeks": 24,
  "recommendations": [
    {
      "skill": "Machine Learning",
      "weeks": 8,
      "resources": ["Andrew Ng's ML Course", "Hands-On ML Book"]
    }
  ],
  "roadmap": [
    {
      "skill": "Machine Learning",
      "weeks": 8,
      "milestone": "Complete fundamental ML algorithms"
    }
  ]
}
```

**Parameters:**
- `target_role`: One of "Data Scientist", "AI Engineer", "Web Developer", "Cybersecurity Analyst"
- `current_skills`: Comma-separated skill names
- `proficiency`: "Beginner", "Intermediate", or "Advanced"
- `weekly_hours`: Number of hours per week (1-40)

**Errors:**
- 400: Missing required fields
- 401: Unauthorized
- 429: Rate limit exceeded

---

### 3. Assessment History

#### GET /history
Retrieve all user assessments.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "date": "2026-05-13T10:30:00",
    "target_role": "Data Scientist",
    "match_score": 65,
    "missing_skills": "Machine Learning,TensorFlow,Big Data",
    "details": { ... }
  },
  {
    "id": 2,
    "date": "2026-05-10T14:20:00",
    "target_role": "Web Developer",
    "match_score": 72,
    "missing_skills": "React,TypeScript",
    "details": { ... }
  }
]
```

**Query Parameters:**
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)

**Errors:**
- 401: Unauthorized

---

### 4. User Profile

#### GET /profile
Get current user profile and statistics.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "target_role": "Data Scientist",
  "latest_match": 65,
  "assessment_count": 5,
  "current_skills": "Python,SQL,Statistics"
}
```

**Errors:**
- 401: Unauthorized

---

## Error Responses

All errors follow this format:

```json
{
  "error": "error_code",
  "message": "Human readable message"
}
```

### Common Error Codes:
- `missing`: Missing required fields
- `invalid`: Invalid input format or credentials
- `unauthorized`: Missing or invalid token
- `not_found`: Resource not found
- `conflict`: Resource already exists
- `rate_limit`: Too many requests

---

## Rate Limiting

- **Limit**: 100 requests per 60 seconds per IP
- **Headers**: Include `X-RateLimit-Remaining` in response
- **Exceeded**: Returns 429 Too Many Requests

---

## CORS

Allowed origins:
- http://localhost:3000 (dev frontend)
- http://localhost:5173 (Vite dev server)

---

## Example Usage

### JavaScript/Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

// Sign up
const signup = await api.post('/signup', {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'SecurePass123!'
});
const token = signup.data.token;

// Analyze skills
const analysis = await api.post('/analyze', {
  target_role: 'Data Scientist',
  current_skills: 'Python, SQL',
  proficiency: 'Intermediate',
  weekly_hours: 10
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

### cURL
```bash
# Login
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}'

# Analyze skills
curl -X POST http://localhost:5000/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "target_role": "Data Scientist",
    "current_skills": "Python, SQL",
    "proficiency": "Intermediate",
    "weekly_hours": 10
  }'
```

---

## Versioning

Current API version: 1.0
Future versions will use `/api/v2/...` pattern.

---

## Support

For issues or questions, open an issue on GitHub or contact support@skillgap-navigator.com
