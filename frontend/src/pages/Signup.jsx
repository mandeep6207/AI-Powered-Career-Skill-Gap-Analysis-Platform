import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { validatePassword, validateEmail, validateUsername } from '../utils/validation'

export default function Signup(){
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pwdStrength, setPwdStrength] = useState(null)
  const { signup } = useContext(AuthContext)
  const nav = useNavigate()

  const [error, setError] = useState(null)
  const [ok, setOk] = useState(false)

  const handlePasswordChange = (val) => {
    setPassword(val)
    setPwdStrength(validatePassword(val))
  }

  const submit = async e => {
    e.preventDefault()
    setError(null)

    // Validate all fields
    const uValidate = validateUsername(username)
    if (!uValidate.valid) return setError('Username: ' + uValidate.errors[0])
    if (!validateEmail(email)) return setError('Invalid email format')
    const pValidate = validatePassword(password)
    if (!pValidate.valid) return setError('Password: ' + pValidate.errors[0])

    try {
      await signup(username, email, password)
      setOk(true)
      setTimeout(()=>nav('/login'), 1200)
    } catch(err){ setError(err?.response?.data?.error || 'Signup failed') }
  }

  return (
    <div className="card p-4 mx-auto" style={{maxWidth:600}}>
      <h3>Sign up</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {ok && <div className="alert alert-success">Account created — redirecting to login</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <input required className="form-control" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <small className="text-muted">3+ chars, letters/numbers/hyphen</small>
        </div>
        <div className="mb-3">
          <input required type="email" className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <input required type="password" className="form-control" placeholder="Password" value={password} onChange={e=>handlePasswordChange(e.target.value)} />
          {pwdStrength && (
            <div className="mt-2">
              <div className="progress" style={{height: '4px'}}>
                <div className="progress-bar" style={{width: pwdStrength.strength + '%', backgroundColor: pwdStrength.strength < 50 ? '#dc3545' : pwdStrength.strength < 80 ? '#ffc107' : '#28a745'}}></div>
              </div>
              {pwdStrength.errors.length > 0 && <small className="text-danger d-block mt-1">{pwdStrength.errors[0]}</small>}
            </div>
          )}
        </div>
        <button className="btn btn-primary">Create account</button>
      </form>
    </div>
  )
}
