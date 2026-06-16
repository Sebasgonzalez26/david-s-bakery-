import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: agrega el token JWT en cada request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('bakery_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor: si la API devuelve 401, redirige al login
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bakery_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
