import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5000' })

// attach token from localStorage if present
const token = localStorage.getItem('token')
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`

// Request interceptor: add logging and auth token
api.interceptors.request.use(
  config => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${config.method.toUpperCase()} ${config.url}`)
    
    // Update token from localStorage on each request
    const freshToken = localStorage.getItem('token')
    if (freshToken) config.headers.Authorization = `Bearer ${freshToken}`
    
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor: handle errors and log responses
api.interceptors.response.use(
  response => {
    console.log(`[${new Date().toISOString()}] Response ${response.status} from ${response.config.url}`)
    return response
  },
  error => {
    if (error.response?.status === 401) {
      // Auto-logout on auth failure
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    console.error(`[${new Date().toISOString()}] API Error:`, error.response?.status, error.response?.data?.error)
    return Promise.reject(error)
  }
)

export default api
