import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const nav = useNavigate()

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const submit = async e => {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      await login(email, password)
      nav('/dashboard')
    } catch(err){ setError(err?.response?.data?.error || 'Login failed') }
    setLoading(false)
  }

  return (
    <div className="card p-4 mx-auto" style={{maxWidth:600}}>
      <h3>Log in</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <div className="mb-3"><input required type="email" className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="mb-3"><input required type="password" className="form-control" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}
