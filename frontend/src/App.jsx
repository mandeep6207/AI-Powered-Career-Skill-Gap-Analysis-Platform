import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import Roadmap from './pages/Roadmap'
import History from './pages/History'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <div>
      <Navbar />
      <div className="container-sm mt-4">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/assessment" element={<ProtectedRoute><Assessment/></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><Roadmap/></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History/></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}
