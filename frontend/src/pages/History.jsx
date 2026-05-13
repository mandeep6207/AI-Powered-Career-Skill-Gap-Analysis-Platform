import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function History(){
  const [history, setHistory] = useState([])
  useEffect(()=>{ api.get('/history').then(r=>setHistory(r.data)).catch(()=>{}) },[])

  return (
    <div className="card p-4">
      <h3>Assessment History</h3>
      <table className="table">
        <thead><tr><th>Date</th><th>Role</th><th>Match</th><th>Missing Skills</th></tr></thead>
        <tbody>
          {history.map(h=> <tr key={h.id}><td>{h.date}</td><td>{h.target_role}</td><td>{h.match_score}%</td><td>{h.missing_skills}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
