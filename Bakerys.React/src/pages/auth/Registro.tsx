import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '../../services/authService'

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombreUsuario:     '',
    correoElectronico: '',
    password:          '',
    codigoRegistro:    '',
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [exito,   setExito]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombreUsuario || !form.correoElectronico || !form.password || !form.codigoRegistro) {
      setError('Todos los campos son requeridos.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const hash = await sha256(form.password)
      await authService.registrar({
        nombreUsuario:     form.nombreUsuario,
        correoElectronico: form.correoElectronico,
        passwordHash:      hash,
        codigoRegistro:    form.codigoRegistro,
      })
      setExito(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      const msg = err?.response?.data?.mensaje
      setError(msg ?? 'Error al registrar. Verificá el código de acceso.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px',
    border: '1px solid hsl(var(--border))',
    borderRadius: 10, fontSize: 13,
    color: 'hsl(var(--foreground))',
    background: 'hsl(var(--secondary))',
    outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'hsl(var(--background))',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'hsl(var(--foreground))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', fontWeight: 400 }}>D</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'hsl(var(--foreground))', letterSpacing: -0.5, marginBottom: 4 }}>
            Crear cuenta
          </h1>
          <p style={{ fontSize: 13, color: 'hsl(var(--muted-fg))' }}>Necesitás un código de acceso para registrarte</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 20, padding: 32, boxShadow: 'var(--shadow-md)' }}>
          {exito ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
              <p style={{ fontSize: 14, color: '#28825a', fontWeight: 500 }}>Cuenta creada correctamente</p>
              <p style={{ fontSize: 12, color: 'hsl(var(--muted-fg))' }}>Redirigiendo al login…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: 'rgba(180,42,42,0.06)', border: '1px solid rgba(180,42,42,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#b42a2a', marginBottom: 20 }}>
                  {error}
                </div>
              )}

              {[
                { label: 'Nombre de usuario', key: 'nombreUsuario',     type: 'text',     placeholder: '' },
                { label: 'Correo electrónico', key: 'correoElectronico', type: 'email',    placeholder: '' },
                { label: 'Contraseña',          key: 'password',         type: 'password', placeholder: '' },
                { label: 'Código de acceso',    key: 'codigoRegistro',   type: 'password', placeholder: 'Código provisto por el administrador' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'hsl(var(--foreground))', marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    style={inputStyle}
                    value={(form as any)[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              ))}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '12px',
                background: loading ? 'hsl(var(--muted))' : 'hsl(var(--foreground))',
                color: '#fff', border: 'none', borderRadius: 100,
                fontSize: 14, fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 8, transition: 'background 0.15s',
              }}>
                {loading ? 'Registrando…' : 'Crear cuenta'}
              </button>

              <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'hsl(var(--muted-fg))' }}>
                ¿Ya tenés cuenta?{' '}
                <Link to="/login" style={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}>Ingresar</Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
