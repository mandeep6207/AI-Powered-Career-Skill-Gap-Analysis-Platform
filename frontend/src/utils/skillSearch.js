// Simple fuzzy string matcher for skill autocomplete
export function fuzzymatch(pattern, text) {
  let patIdx = 0
  let textIdx = 0
  let matched = 0

  while (textIdx < text.length) {
    if (pattern.charCodeAt(patIdx) === text.charCodeAt(textIdx)) {
      matched++
      patIdx++
    }
    if (patIdx === pattern.length) return true
    textIdx++
  }
  return false
}

export function searchSkills(query, allSkills) {
  if (!query) return []
  const q = query.toLowerCase()
  return allSkills
    .filter(s => fuzzymatch(q, s.toLowerCase()))
    .sort((a, b) => {
      if (a.toLowerCase().startsWith(q)) return -1
      if (b.toLowerCase().startsWith(q)) return 1
      return a.localeCompare(b)
    })
    .slice(0, 5)
}

export const COMMON_SKILLS = [
  'Python', 'JavaScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP',
  'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
  'SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'MySQL',
  'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
  'HTML', 'CSS', 'Bootstrap', 'Tailwind',
  'Data Science', 'Data Visualization', 'Statistics', 'Analytics'
]
