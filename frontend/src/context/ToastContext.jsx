import React, { createContext, useState, useCallback } from 'react'

export const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    if (duration > 0) setTimeout(() => removeToast(id), duration)
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        {toasts.map(toast => (
          <div key={toast.id} className={`alert alert-${toast.type === 'error' ? 'danger' : toast.type} alert-dismissible fade show`} role="alert">
            {toast.message}
            <button type="button" className="btn-close" onClick={() => removeToast(toast.id)}></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
