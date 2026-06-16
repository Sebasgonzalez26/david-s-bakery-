import axios from 'axios'

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  headers: { 'Content-Type': 'application/json' },
})

export interface LoginRequest {
  correoElectronico: string
  passwordHash:      string
}


export interface RegistroRequest {
  nombreUsuario:     string
  correoElectronico: string
  passwordHash:      string
  codigoRegistro:    string
}

export interface TokenResponse {
  validacionExitosa: boolean
  accessToken:       string
}

export const authService = {
  login: (data: LoginRequest) =>
    authApi.post<TokenResponse>('/Autenticacion/login', data),

  registrar: (data: RegistroRequest) =>
    authApi.post('/Usuario/registrar', data),

  guardarToken: (token: string) =>
    localStorage.setItem('bakery_token', token),

  obtenerToken: () =>
    localStorage.getItem('bakery_token'),

  cerrarSesion: () =>
    localStorage.removeItem('bakery_token'),

  estaAutenticado: () =>
    !!localStorage.getItem('bakery_token'),

  solicitarRecuperacion: (correoElectronico: string) =>
    authApi.post('/Recuperacion/solicitar', { correoElectronico }),

  validarTokenRecuperacion: (token: string) =>
    authApi.get(`/Recuperacion/validar?token=${token}`),

  restablecerPassword: (token: string, passwordHash: string) =>
    authApi.post('/Recuperacion/restablecer', { token, passwordHash }),
}
