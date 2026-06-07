import axios from 'axios'

const authApi = axios.create({
  baseURL: 'https://localhost:7021/api',
  headers: { 'Content-Type': 'application/json' },
})

export interface LoginRequest {
  nombreUsuario:     string
  passwordHash:      string
  correoElectronico: string
}

export interface TokenResponse {
  validacionExitosa: boolean
  accessToken:       string
}

export const authService = {
  login: (data: LoginRequest) =>
    authApi.post<TokenResponse>('/Autenticacion/login', data),

  registrar: (data: LoginRequest) =>
    authApi.post('/Usuario/registrar', data),

  guardarToken: (token: string) =>
    localStorage.setItem('bakery_token', token),

  obtenerToken: () =>
    localStorage.getItem('bakery_token'),

  cerrarSesion: () =>
    localStorage.removeItem('bakery_token'),

  estaAutenticado: () =>
    !!localStorage.getItem('bakery_token'),
}
