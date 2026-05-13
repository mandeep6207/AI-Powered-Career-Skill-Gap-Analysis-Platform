import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement)

export default function Dashboard(){
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(()=>{
    api.get('/profile').then(r=>setProfile(r.data)).catch(()=>{})
    api.get('/history').then(r=>setHistory(r.data)).catch(()=>{})
  },[])

  const match = profile?.latest_match || 0
  const missing = profile?.missing_count || 0

  const doughnut = { labels:['Matched','Missing'], datasets:[{ data:[match, 100-match], backgroundColor:['#4caf50','#f44336'] }] }

  // build skill priority bar from latest assessment details if available
  const latestDetails = history[0]?.details
  const priorityLabels = latestDetails?.priority_skills || []
  const priorityData = priorityLabels.map((_,i)=> (priorityLabels.length - i) * 10)

  const bar = { labels: priorityLabels, datasets: [{ label: 'Priority', data: priorityData, backgroundColor: '#1976d2' }] }

  // progress trend from history
  const trendLabels = history.slice(0,10).map(h=> h.date.split('T')[0]).reverse()
  const trendData = history.slice(0,10).map(h=> h.match_score).reverse()
  const line = { labels: trendLabels, datasets: [{ label: 'Match %', data: trendData, borderColor:'#4caf50', tension:0.3 }] }

  return (
    <div>
      <h3>Dashboard</h3>
      <div className="row g-3">
        <div className="col-md-4"><div className="card p-3"><h6>Overall Match</h6><Doughnut data={doughnut} /></div></div>
        <div className="col-md-4"><div className="card p-3"><h6>Skill Priority</h6>{priorityLabels.length ? <Bar data={bar} /> : <p className="small">No priority data yet</p>}</div></div>
        <div className="col-md-4"><div className="card p-3"><h6>Progress Trend</h6>{trendLabels.length ? <Line data={line} /> : <p className="small">No history yet</p>}</div></div>
      </div>

      <div className="mt-4 card p-3">
        <h5>Recent Assessments</h5>
        <ul className="list-group">
          {history.map(h=> <li key={h.id} className="list-group-item">{new Date(h.date).toLocaleString()} — {h.target_role} — {h.match_score}%</li>)}
        </ul>
      </div>
    </div>
  )
}
