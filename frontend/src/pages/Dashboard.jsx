import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement)

export default function Dashboard(){
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(()=>{ api.get('/profile').then(r=>setProfile(r.data)).catch(()=>{})
    api.get('/history').then(r=>setHistory(r.data)).catch(()=>{})
  },[])

  const match = profile?.latest_match || 0
  const missing = profile?.missing_count || 0

  const doughnut = { labels:['Matched','Missing'], datasets:[{ data:[match, 100-match], backgroundColor:['#4caf50','#f44336'] }] }

  return (
    <div>
      <h3>Dashboard</h3>
      <div className="row">
        <div className="col-md-6"><div className="card p-3"><h5>Overall Match</h5><Doughnut data={doughnut} /></div></div>
        <div className="col-md-6"><div className="card p-3"><h5>History</h5>
          <ul className="list-group">
            {history.map(h=> <li key={h.id} className="list-group-item">{h.date} — {h.target_role} — {h.match_score}%</li>)}
          </ul>
        </div></div>
      </div>
    </div>
  )
}
