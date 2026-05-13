import React, { useState } from 'react'
import api from '../services/api'

export default function Assessment(){
  const [role, setRole] = useState('Data Scientist')
  const [skills, setSkills] = useState('')
  const [proficiency, setProficiency] = useState('Intermediate')
  const [hours, setHours] = useState(6)
  const [result, setResult] = useState(null)

  const submit = async e => {
    e.preventDefault()
    const res = await api.post('/analyze', { target_role: role, current_skills: skills, proficiency, weekly_hours: hours })
    setResult(res.data)
  }

  return (
    <div className="card p-4">
      <h3>Skill Assessment</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Target role</label>
          <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
            <option>Data Scientist</option>
            <option>AI Engineer</option>
            <option>Web Developer</option>
            <option>Cybersecurity Analyst</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Current skills (comma separated)</label>
          <input className="form-control" value={skills} onChange={e=>setSkills(e.target.value)} />
        </div>

        <div className="mb-3">
          <label>Skill proficiency</label>
          <select className="form-select" value={proficiency} onChange={e=>setProficiency(e.target.value)}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Weekly study hours</label>
          <input type="number" className="form-control" value={hours} onChange={e=>setHours(e.target.value)} />
        </div>

        <button className="btn btn-primary">Analyze</button>
      </form>

      {result && (
        <div className="mt-4">
          <h5>Match: {result.match_percentage}%</h5>
          <p>Missing: {result.missing_skills.join(', ')}</p>
          <p>Estimated weeks: {result.estimated_weeks}</p>
        </div>
      )}
    </div>
  )
}
