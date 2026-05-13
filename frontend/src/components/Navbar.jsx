import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { DarkModeContext } from '../context/DarkModeContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const { isDark, toggle } = useContext(DarkModeContext)
  const nav = useNavigate()

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-sm">
        <Link className="navbar-brand" to="/">SkillGap Navigator</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><button className="btn btn-link nav-link" onClick={toggle} title="Toggle dark mode">{isDark ? '☀️' : '🌙'}</button></li>
            {!user ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/signup">Sign up</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/login">Log in</Link></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                <li className="nav-item"><button className="btn btn-link nav-link" onClick={() => { logout(); nav('/') }}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
