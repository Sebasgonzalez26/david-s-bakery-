import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { clienteService } from '../../services/clienteService'
import { FormCard, FormGroup, PageHeader } from '../../components/FormShared'

export default function ClienteAgregar() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', notas: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.telefono.trim()) { setError('Nombre y teléfono son requeridos.'); return }
    setSaving(true)
    try {
      await clienteService.create(form)
      navigate('/clientes')
    } catch { setError('Error al guardar.'); setSaving(false) }
  }

  return (
    <div>
      <PageHeader title="Nuevo Cliente" sub="Registrar un cliente en el sistema" backTo="/clientes" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} style={{ maxWidth: 540 }}>
        <FormCard title="Datos del Cliente">
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {error && <div style={errorStyle}>{error}</div>}
            <FormGroup label="Nombre completo *">
              <input style={input} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </FormGroup>
            <FormGroup label="Teléfono *">
              <input style={input} value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
            </FormGroup>
            <FormGroup label="Email">
              <input type="email" style={input} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </FormGroup>
            <FormGroup label="Notas">
              <textarea style={{ ...input, resize: 'vertical', minHeight: 80 }} value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} />
            </FormGroup>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              <Link to="/clientes" style={outlineBtn}>Cancelar</Link>
              <button type="submit" disabled={saving} style={primaryBtn}>{saving ? 'Guardando…' : '✓ Guardar'}</button>
            </div>
          </form>
        </FormCard>
      </motion.div>
    </div>
  )
}

const input: React.CSSProperties = { width: '100%', padding: '10px 13px', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-body)', color: 'hsl(var(--foreground))', background: '#fff', outline: 'none', boxSizing: 'border-box' }
const primaryBtn: React.CSSProperties = { background: 'hsl(var(--foreground))', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 22px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }
const outlineBtn: React.CSSProperties = { border: '1px solid hsl(var(--border))', borderRadius: 100, padding: '9px 18px', fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }
const errorStyle: React.CSSProperties = { background: 'rgba(180,42,42,0.06)', border: '1px solid rgba(180,42,42,0.18)', borderRadius: 8, padding: '10px 13px', fontSize: 13, color: '#b42a2a', marginBottom: 18 }
