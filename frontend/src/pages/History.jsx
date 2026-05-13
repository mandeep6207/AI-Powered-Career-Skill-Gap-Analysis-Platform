import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function History(){
  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState(null)
  useEffect(()=>{ api.get('/history').then(r=>setHistory(r.data)).catch(()=>{}) },[])

  return (
    <div className="card p-4">
      <h3>Assessment History</h3>
      <table className="table">
        <thead><tr><th>Date</th><th>Role</th><th>Match</th><th>Missing Skills</th><th></th></tr></thead>
        <tbody>
          {history.map(h=> (
            <tr key={h.id}>
              <td>{new Date(h.date).toLocaleString()}</td>
              <td>{h.target_role}</td>
              <td>{h.match_score}%</td>
              <td>{h.missing_skills}</td>
              <td><button className="btn btn-sm btn-outline-primary" onClick={()=> setSelected(h.details)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="mt-3 card p-3">
          <h5>Assessment Details</h5>
          <p><strong>Match:</strong> {selected.match_percentage}%</p>
          <p><strong>Missing:</strong> {selected.missing_skills.join(', ')}</p>
          <p><strong>Recommendations:</strong></p>
          <ul>{selected.recommendations.map((r,i)=> <li key={i}>{r}</li>)}</ul>
        </div>
      )}
    </div>
  )
}
