import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/profile').then(res => setUser(res.data)).catch(()=>{})
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password })
    setToken(res.data.token)
    return res.data
  }

  const signup = async (username, email, password) => {
    const res = await api.post('/signup', { username, email, password })
    return res.data
  }

  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
