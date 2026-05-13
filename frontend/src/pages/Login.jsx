import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    await login(email, password)
    nav('/dashboard')
  }

  return (
    <div className="card p-4 mx-auto" style={{maxWidth:600}}>
      <h3>Log in</h3>
      <form onSubmit={submit}>
        <div className="mb-3"><input required type="email" className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="mb-3"><input required type="password" className="form-control" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button className="btn btn-primary">Sign in</button>
      </form>
    </div>
  )
}
