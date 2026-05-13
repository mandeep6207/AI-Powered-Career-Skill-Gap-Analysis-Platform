import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Roadmap(){
  const [roadmap, setRoadmap] = useState([])
  useEffect(()=>{
    api.get('/history').then(r=>{
      const latest = r.data[0]?.details
      setRoadmap(latest?.roadmap || [])
    }).catch(()=>{})
  },[])

  return (
    <div className="card p-4">
      <h3>Roadmap</h3>
      {roadmap.length ? (
        <div>
          <ol>
            {roadmap.map((m,i)=> <li key={i}>{m.skill} — {m.weeks} weeks — {m.milestone}</li>)}
          </ol>
          <p><strong>Total estimated weeks:</strong> {roadmap.reduce((s,r)=> s + (r.weeks||0),0)}</p>
        </div>
      ) : (
        <p>No roadmap available yet — complete an assessment to generate a personalized plan.</p>
      )}
    </div>
  )
}
