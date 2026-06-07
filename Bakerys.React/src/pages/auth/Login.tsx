import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '../../services/authService'

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const welcomeText = 'Welcome back.'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ correoElectronico: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.correoElectronico || !form.password) {
      setError('Todos los campos son requeridos.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const hash = await sha256(form.password)
      const res  = await authService.login({
        correoElectronico: form.correoElectronico,
        passwordHash:      hash,
      })
      if (!res.data.validacionExitosa) {
        setError('Credenciales inválidas. Verificá tu correo y contraseña.')
        return
      }
      authService.guardarToken(res.data.accessToken)
      navigate('/')
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>

      {/* ── Left panel ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -48 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flex: 1,
          background: 'linear-gradient(145deg, #0a0a0f 0%, #13131f 45%, #1a102e 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '44px 52px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glows */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)',
            top: -140, right: -120,
          }} />
          <div style={{
            position: 'absolute', width: 360, height: 360, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%)',
            bottom: 60, left: -80,
          }} />
        </div>

        {/* Top logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}
        >
          <div style={{
            width: 54, height: 54, borderRadius: 15,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#fff' }}>D</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 500, letterSpacing: 0.4 }}>
            Davi's Bakery
          </span>
        </motion.div>

        {/* Animated headline */}
        <div style={{ position: 'relative' }}>
          <div style={{ marginBottom: 22, lineHeight: 1 }}>
            {welcomeText.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: 72, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.45 + i * 0.028,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  display: 'inline-block',
                  fontSize: 58,
                  fontWeight: 800,
                  letterSpacing: -2.5,
                  color: char === '.' ? '#7c3aed' : '#ffffff',
                  whiteSpace: 'pre',
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.55 }}
            style={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: 15,
              lineHeight: 1.75,
              maxWidth: 300,
            }}
          >
            Gestioná pedidos, inventario, pagos y finanzas desde un solo lugar.
          </motion.p>

          {/* Decorative pill tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 0.4 }}
            style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}
          >
            {['Pedidos', 'Inventario', 'Finanzas', 'Pagos'].map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 500,
                color: 'rgba(255,255,255,0.35)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 100,
                padding: '4px 12px',
                letterSpacing: 0.4,
              }}>
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Developer credit */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          style={{
            fontSize: 11.5,
            color: 'rgba(255,255,255,0.18)',
            letterSpacing: 0.4,
            position: 'relative',
          }}
        >
          Desarrollado por{' '}
          <span style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 600 }}>
            Sebastián González Rojas
          </span>
        </motion.p>
      </motion.div>

      {/* ── Right panel — form ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 48 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 480,
          background: '#f9f9fb',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 52px',
          position: 'relative',
        }}
      >
        {/* Form header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{ marginBottom: 36 }}
        >
          <h2 style={{
            fontSize: 26, fontWeight: 750, color: '#0a0a0f',
            letterSpacing: -0.8, marginBottom: 6,
          }}>
            Iniciá sesión
          </h2>
          <p style={{ fontSize: 13.5, color: '#9ca3af' }}>
            Ingresá tus credenciales para continuar
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 12, padding: '11px 16px',
                fontSize: 13, color: '#dc2626', marginBottom: 24,
              }}
            >
              {error}
            </motion.div>
          )}

          {([
            { label: 'Correo electrónico', key: 'correoElectronico', type: 'email',     placeholder: 'tu@correo.com',  auto: 'email' },
            { label: 'Contraseña',          key: 'password',          type: 'password',  placeholder: '••••••••',        auto: 'current-password' },
          ] as const).map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.1, duration: 0.45 }}
              style={{ marginBottom: 20 }}
            >
              <label style={{
                display: 'block', fontSize: 12.5, fontWeight: 600,
                color: '#374151', marginBottom: 8, letterSpacing: 0.2,
              }}>
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.auto}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 16px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 12, fontSize: 14,
                  color: '#0a0a0f', background: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.18s, box-shadow 0.18s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#7c3aed'
                  e.target.style.boxShadow   = '0 0 0 3px rgba(124,58,237,0.12)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e5e7eb'
                  e.target.style.boxShadow   = 'none'
                }}
                value={(form as any)[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.45 }}
          >
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.018 }}
              whileTap={{ scale: loading ? 1 : 0.982 }}
              type="submit"
              disabled={loading}
              style={{
                width: '100%', marginTop: 8,
                padding: '13px',
                background: loading
                  ? '#e5e7eb'
                  : 'linear-gradient(135deg, #13131f 0%, #1a102e 100%)',
                color: loading ? '#9ca3af' : '#fff',
                border: 'none', borderRadius: 100,
                fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: 0.3,
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Verificando…' : 'Ingresar →'}
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
            style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#9ca3af' }}
          >
            ¿Primera vez?{' '}
            <Link to="/registro" style={{
              color: '#7c3aed', fontWeight: 600, textDecoration: 'none',
            }}>
              Crear cuenta
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  )
}
