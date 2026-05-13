import datetime
from typing import List, Dict

ROLE_SKILLS = {
    'Data Scientist': ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Visualization'],
    'AI Engineer': ['Python', 'Deep Learning', 'NLP', 'TensorFlow'],
    'Web Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    'Cybersecurity Analyst': ['Networking', 'Linux', 'Security Fundamentals', 'Incident Response']
}

def analyze(target_role: str, current_skills: List[str], proficiency:str, weekly_hours:int) -> Dict:
    required = ROLE_SKILLS.get(target_role, [])
    current = [s.strip().lower() for s in current_skills]

    found = [r for r in required if r.lower() in current]
    missing = [r for r in required if r.lower() not in current]

    match_percentage = int(len(found) / max(len(required),1) * 100)

    # priority: missing skills
    priority = missing[:]

    # estimated weeks: assume 2-6 weeks per missing skill based on proficiency
    per_skill = {'Beginner':6,'Intermediate':4,'Advanced':2}
    weeks_per = per_skill.get(proficiency,4)
    estimated_weeks = weeks_per * len(missing)
    if weekly_hours >= 15:
        estimated_weeks = max(1, int(estimated_weeks * 0.6))
    elif weekly_hours >= 8:
        estimated_weeks = int(estimated_weeks * 0.9)

    recommendations = [f"Study {s}: aim {weeks_per} weeks" for s in priority]

    roadmap = []
    for i, s in enumerate(priority):
        roadmap.append({'skill':s, 'weeks': weeks_per, 'milestone': f'Learn {s}'})

    return {
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
