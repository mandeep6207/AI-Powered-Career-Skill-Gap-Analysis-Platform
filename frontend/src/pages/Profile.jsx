import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Profile(){
  const [profile, setProfile] = useState(null)
  useEffect(()=>{ api.get('/profile').then(r=>setProfile(r.data)).catch(()=>{}) },[])

  if(!profile) return <p>Loading...</p>

  return (
    <div className="card p-4">
      <h3>Profile</h3>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Target role:</strong> {profile.target_role || '-'}</p>
      <p><strong>Latest match:</strong> {profile.latest_match || 'N/A'}</p>
    </div>
  )
}
