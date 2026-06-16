import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '../../services/authService'

export default function OlvideContrasena() {
  const [correo,   setCorreo]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [enviado,  setEnviado]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!correo) { setError('Ingresá tu correo.'); return }
    setLoading(true)
    setError('')
    try {
      await authService.solicitarRecuperacion(correo)
      setEnviado(true)
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>

      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -48 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75 }}
        style={{
          flex: '0 0 60%',
          background: 'linear-gradient(145deg, #120a04 0%, #1e1008 50%, #2a1508 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '44px 52px', position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,110,40,0.18) 0%, transparent 65%)', top: -140, right: -120 }} />
          <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,60,20,0.14) 0%, transparent 65%)', bottom: 60, left: -80 }} />
        </div>

        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{ width: 54, height: 54, borderRadius: 15, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#fff' }}>D</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 500, letterSpacing: 0.4 }}>Davi's Bakery</span>
        </motion.div>

        <div style={{ position: 'relative' }}>
          {'No problem.'.split('').map((char, i) => (
            <motion.span key={i}
              initial={{ y: 72, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 + i * 0.028, duration: 0.55 }}
              style={{ display: 'inline-block', fontSize: 72, fontWeight: 800, letterSpacing: -3, color: char === '.' ? '#c9a060' : '#ffffff', whiteSpace: 'pre' }}
            >{char}</motion.span>
          ))}
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.55 }}
            style={{ color: 'rgba(255,255,255,0.38)', fontSize: 16, lineHeight: 1.75, maxWidth: 340, marginTop: 20 }}>
            Ingresá tu correo y te enviamos un enlace para restablecer tu contraseña.
          </motion.p>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.18)', letterSpacing: 0.4, position: 'relative' }}>
          Desarrollado por <span style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 600 }}>Sebastián González Rojas</span>
        </motion.p>
      </motion.div>

      {/* Right panel */}
      <motion.div
        initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75 }}
        style={{ flex: 1, background: '#fdf8f2', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 52px' }}
      >
        {enviado ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 14 }}
              style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #f5e6cc, #e8c88a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32 }}>
              ✉
            </motion.div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e1008', marginBottom: 8 }}>Revisá tu correo</h2>
            <p style={{ fontSize: 14, color: '#a89070', marginBottom: 24 }}>Si el correo está registrado, recibirás el enlace en los próximos minutos.</p>
            <Link to="/login" style={{ color: '#8b6040', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>← Volver al login</Link>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 26, fontWeight: 750, color: '#1e1008', letterSpacing: -0.8, marginBottom: 6 }}>Olvidé mi contraseña</h2>
              <p style={{ fontSize: 13.5, color: '#a89070' }}>Te enviamos un enlace de recuperación a tu correo</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '11px 16px', fontSize: 13, color: '#dc2626', marginBottom: 24 }}>
                  {error}
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#4a3020', marginBottom: 8 }}>Correo electrónico</label>
                <input
                  type="email" placeholder="tu@correo.com" autoComplete="email"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', border: '1.5px solid #e8d8c4', borderRadius: 12, fontSize: 14, color: '#1e1008', background: '#fff', outline: 'none', transition: 'border-color 0.18s, box-shadow 0.18s' }}
                  onFocus={e => { e.target.style.borderColor = '#8b6040'; e.target.style.boxShadow = '0 0 0 3px rgba(139,96,64,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = '#e8d8c4'; e.target.style.boxShadow = 'none' }}
                  value={correo} onChange={e => setCorreo(e.target.value)}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}>
                <motion.button whileHover={{ scale: loading ? 1 : 1.018 }} whileTap={{ scale: loading ? 1 : 0.982 }}
                  type="submit" disabled={loading}
                  style={{ width: '100%', marginTop: 8, padding: '13px', background: loading ? '#e8d8c4' : 'linear-gradient(135deg, #3d1f08 0%, #1e1008 100%)', color: loading ? '#a89070' : '#fff', border: 'none', borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
                  {loading ? 'Enviando…' : 'Enviar enlace →'}
                </motion.button>
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#a89070' }}>
                <Link to="/login" style={{ color: '#8b6040', fontWeight: 600, textDecoration: 'none' }}>← Volver al login</Link>
              </motion.p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
