import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '../../services/authService'

async function sha256(text: string): Promise<string> {
  const buf    = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]   = useState({ nombreUsuario: '', correoElectronico: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombreUsuario || !form.correoElectronico || !form.password) {
      setError('Todos los campos son requeridos.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const hash = await sha256(form.password)
      const res  = await authService.login({
        nombreUsuario:     form.nombreUsuario,
        correoElectronico: form.correoElectronico,
        passwordHash:      hash,
      })
      if (!res.data.validacionExitosa) {
        setError('Credenciales inválidas.')
        return
      }
      authService.guardarToken(res.data.accessToken)
      navigate('/')
    } catch {
      setError('Error al conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'hsl(var(--background))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'hsl(var(--foreground))',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', fontWeight: 400 }}>D</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, color: 'hsl(var(--foreground))', letterSpacing: -0.5, marginBottom: 6 }}>
            Davi's Bakery
          </h1>
          <p style={{ fontSize: 13, color: 'hsl(var(--muted-fg))' }}>Ingresá tus credenciales para continuar</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          border: '1px solid hsl(var(--border))',
          borderRadius: 20,
          padding: 32,
          boxShadow: 'var(--shadow-md)',
        }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: 'rgba(180,42,42,0.06)',
                border: '1px solid rgba(180,42,42,0.2)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                color: '#b42a2a',
                marginBottom: 20,
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'hsl(var(--foreground))', marginBottom: 6 }}>
                Usuario
              </label>
              <input
                type="text"
                autoComplete="username"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '10px 14px',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 10, fontSize: 13,
                  color: 'hsl(var(--foreground))',
                  background: 'hsl(var(--secondary))',
                  outline: 'none',
                }}
                value={form.nombreUsuario}
                onChange={e => setForm({ ...form, nombreUsuario: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'hsl(var(--foreground))', marginBottom: 6 }}>
                Correo electrónico
              </label>
              <input
                type="email"
                autoComplete="email"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '10px 14px',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 10, fontSize: 13,
                  color: 'hsl(var(--foreground))',
                  background: 'hsl(var(--secondary))',
                  outline: 'none',
                }}
                value={form.correoElectronico}
                onChange={e => setForm({ ...form, correoElectronico: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'hsl(var(--foreground))', marginBottom: 6 }}>
                Contraseña
              </label>
              <input
                type="password"
                autoComplete="current-password"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '10px 14px',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 10, fontSize: 13,
                  color: 'hsl(var(--foreground))',
                  background: 'hsl(var(--secondary))',
                  outline: 'none',
                }}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? 'hsl(var(--muted))' : 'hsl(var(--foreground))',
                color: '#fff',
                border: 'none',
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'hsl(var(--muted-fg))' }}>
              ¿Primera vez?{' '}
              <Link to="/registro" style={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}>Crear cuenta</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
