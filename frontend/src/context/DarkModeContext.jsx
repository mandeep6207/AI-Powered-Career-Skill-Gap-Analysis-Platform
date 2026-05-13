import React, { createContext, useState, useEffect } from 'react'

export const DarkModeContext = createContext()

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('skillgap-dark-mode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('skillgap-dark-mode', JSON.stringify(isDark))
    if (isDark) {
      document.documentElement.style.colorScheme = 'dark'
      document.body.style.backgroundColor = '#1a202c'
      document.body.style.color = '#e2e8f0'
    } else {
      document.documentElement.style.colorScheme = 'light'
      document.body.style.backgroundColor = '#f7fafc'
      document.body.style.color = '#000'
    }
  }, [isDark])

  const toggle = () => setIsDark(!isDark)

  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  )
}
