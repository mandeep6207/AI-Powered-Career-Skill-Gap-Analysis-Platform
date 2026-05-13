import datetime
import hashlib
from typing import List, Dict

ROLE_SKILLS = {
    'Data Scientist': ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Visualization'],
    'AI Engineer': ['Python', 'Deep Learning', 'NLP', 'TensorFlow'],
    'Web Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    'Cybersecurity Analyst': ['Networking', 'Linux', 'Security Fundamentals', 'Incident Response']
}

# Simple cache with TTL
_cache = {}
CACHE_TTL = 3600  # 1 hour


def _cache_key(target_role: str, current_skills: str, proficiency: str, weekly_hours: int) -> str:
    """Generate a cache key hash for the analyze parameters"""
    params = f'{target_role}:{current_skills}:{proficiency}:{weekly_hours}'
    return hashlib.md5(params.encode()).hexdigest()


def _get_cached(key: str) -> Dict:
    """Retrieve from cache if not expired"""
    if key in _cache:
        result, timestamp = _cache[key]
        if datetime.datetime.utcnow().timestamp() - timestamp < CACHE_TTL:
            return result
        del _cache[key]
    return None


def _set_cache(key: str, result: Dict) -> None:
    """Store in cache with timestamp"""
    _cache[key] = (result, datetime.datetime.utcnow().timestamp())


def analyze(target_role: str, current_skills: List[str], proficiency:str, weekly_hours:int) -> Dict:
    # Create cache key from normalized inputs
    skills_str = ','.join(sorted([s.strip().lower() for s in current_skills]))
    cache_key = _cache_key(target_role, skills_str, proficiency, weekly_hours)

    # Check cache first
    cached_result = _get_cached(cache_key)
    if cached_result:
        return cached_result

    required = ROLE_SKILLS.get(target_role, [])
    current = [s.strip().lower() for s in current_skills]

    # match found and missing
    found = [r for r in required if r.lower() in current]
    missing = [r for r in required if r.lower() not in current]

    # base match score from skills
    base_match = (len(found) / max(len(required), 1)) * 100

    # proficiency factor: if user is advanced, boost score
    prof_factor = {'Beginner': 0.6, 'Intermediate': 0.85, 'Advanced': 1.0}
    pf = prof_factor.get(proficiency, 0.85)

    # weekly_hours affects learning speed and also readiness estimation
    hours_factor = min(max(weekly_hours / 10.0, 0.3), 2.0)

    match_percentage = int(min(100, base_match * pf))

    # priority ordering: missing skills first, then skills that are central to role
    priority = missing[:]

    # per-skill effort estimate in weeks (more for beginners)
    effort_by_proficiency = {'Beginner':8, 'Intermediate':5, 'Advanced':3}
    per_skill_base = effort_by_proficiency.get(proficiency, 5)

    # estimated time adjusts by weekly hours
    estimated_weeks = 0
    roadmap = []
    for i, s in enumerate(priority):
        weeks = max(1, int(per_skill_base / hours_factor))
        estimated_weeks += weeks
        roadmap.append({'skill': s, 'weeks': weeks, 'milestone': f'Complete {s} basics -> intermediate'})

    # recommendations: include focused actions and study plan
    recommendations = []
    for s in priority:
        recommendations.append(f"Focus on {s}: target {int(max(1, per_skill_base / hours_factor))} weeks, prioritize hands-on projects.")

    # if nothing missing, recommend deepening and projects
    if not missing:
        recommendations = [f"You already cover core skills for {target_role}. Focus on projects and specialization."]

    result = {
        'target_role': target_role,
        'required_skills': required,
        'found_skills': found,
        'missing_skills': missing,
        'match_percentage': match_percentage,
        'priority_skills': priority,
        'estimated_weeks': estimated_weeks,
        'recommendations': recommendations,
        'roadmap': roadmap,
        'generated_at': datetime.datetime.utcnow().isoformat()
    }

    # Store in cache before returning
    _set_cache(cache_key, result)
    return result
