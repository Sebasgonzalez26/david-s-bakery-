import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { clienteService } from '../../services/clienteService'

export default function ClienteAgregar() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', notas: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.telefono.trim()) {
      setError('Nombre y teléfono son requeridos.')
      return
    }
    setSaving(true)
    try {
      await clienteService.create(form)
      navigate('/clientes')
    } catch {
      setError('Error al guardar. Verifique los datos.')
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={pageTitle}>Nuevo Cliente</h1>
          <p style={pageSub}>Registrar un nuevo cliente en el sistema</p>
        </div>
        <Link to="/clientes" style={outlineBtnStyle}>← Volver</Link>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div style={cardStyle}>
          <div style={cardHeader}>
            <span style={cardTitle}>✏️ Datos del Cliente</span>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {error && (
              <div style={errorStyle}>{error}</div>
            )}

            <FormGroup label="Nombre completo *">
              <input style={inputStyle} value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </FormGroup>

            <FormGroup label="Teléfono *">
              <input style={inputStyle} value={form.telefono}
                onChange={e => setForm({ ...form, telefono: e.target.value })} />
            </FormGroup>

            <FormGroup label="Email">
              <input type="email" style={inputStyle} value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </FormGroup>

            <FormGroup label="Notas">
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.notas}
                onChange={e => setForm({ ...form, notas: e.target.value })} />
            </FormGroup>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <Link to="/clientes" style={outlineBtnStyle}>Cancelar</Link>
              <button type="submit" disabled={saving} style={primaryBtnStyle}>
                {saving ? 'Guardando…' : '✓ Guardar Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--brown-600)', marginBottom: 6, letterSpacing: 0.2 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const pageTitle: React.CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, color: 'var(--brown-800)', margin: '0 0 4px', letterSpacing: -0.5 }
const pageSub: React.CSSProperties = { margin: 0, fontSize: 13, color: 'var(--brown-400)' }
const cardStyle: React.CSSProperties = { background: '#fff', border: '1px solid rgba(212,184,150,0.25)', borderRadius: 16, overflow: 'hidden' }
const cardHeader: React.CSSProperties = { padding: '18px 24px', borderBottom: '1px solid var(--brown-50)', display: 'flex', alignItems: 'center' }
const cardTitle: React.CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500, color: 'var(--brown-800)' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid var(--brown-200)', borderRadius: 10, fontSize: 13, color: 'var(--brown-800)', background: '#fff', outline: 'none', boxSizing: 'border-box' }
const primaryBtnStyle: React.CSSProperties = { background: 'var(--brown-800)', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 22px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }
const outlineBtnStyle: React.CSSProperties = { border: '1px solid var(--brown-200)', borderRadius: 100, padding: '9px 18px', fontSize: 13, fontWeight: 500, color: 'var(--brown-600)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }
const errorStyle: React.CSSProperties = { background: 'rgba(201,64,64,0.08)', border: '1px solid rgba(201,64,64,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--red-500)', marginBottom: 18 }
