import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { clienteService } from '../../services/clienteService'
import { PageHeader, FormCard, FormGroup, inputStyle, primaryBtnStyle, outlineBtnStyle, errorAlertStyle } from '../../components/FormShared'
import { Link } from 'react-router-dom'

export default function ClienteEditar() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', notas: '' })
  const [activo, setActivo] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    clienteService.getById(Number(id)).then(r => {
      const c = r.data
      setForm({ nombre: c.nombre, telefono: c.telefono, email: c.email ?? '', notas: c.notas ?? '' })
      setActivo(c.activo)
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.telefono.trim()) { setError('Nombre y teléfono son requeridos.'); return }
    setSaving(true)
    try {
      await clienteService.update(Number(id), form)
      navigate('/clientes')
    } catch { setError('Error al guardar.'); setSaving(false) }
  }

  const handleToggleActivo = async () => {
    setToggling(true)
    setError('')
    try {
      if (activo) {
        await clienteService.deactivate(Number(id))
        setActivo(false)
      } else {
        await clienteService.activate(Number(id))
        setActivo(true)
      }
    } catch (err: any) {
      const msg = err?.response?.data || (activo ? 'No se pudo desactivar el cliente.' : 'No se pudo activar el cliente.')
      setError(msg)
    } finally {
      setToggling(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: 14 }}>
      <div style={{ width: 28, height: 28, border: '2px solid hsl(var(--border))', borderTopColor: 'hsl(var(--accent))', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div>
      <PageHeader title="Editar Cliente" sub={`Modificar datos de ${form.nombre}`} backTo="/clientes" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} style={{ maxWidth: 540 }}>
        <FormCard title="Datos del Cliente" idLabel={`ID: ${id}`}>
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {error && <div style={errorAlertStyle}>{error}</div>}

            {!activo && (
              <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#856404', display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ Este cliente está <strong>inactivo</strong>. Podés reactivarlo abajo.
              </div>
            )}

            <FormGroup label="Nombre completo *">
              <input style={inputStyle} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </FormGroup>
            <FormGroup label="Teléfono *">
              <input style={inputStyle} value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
            </FormGroup>
            <FormGroup label="Email">
              <input type="email" style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </FormGroup>
            <FormGroup label="Notas">
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} />
            </FormGroup>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <button
                type="button"
                disabled={toggling}
                onClick={handleToggleActivo}
                style={{
                  padding: '9px 18px',
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: toggling ? 'not-allowed' : 'pointer',
                  background: activo ? '#fef2f2' : '#f0fdf4',
                  color: activo ? '#b42a2a' : '#28825a',
                  border: activo ? '1px solid #fca5a5' : '1px solid #86efac',
                  opacity: toggling ? 0.6 : 1,
                }}
              >
                {toggling ? '…' : activo ? '⛔ Desactivar cliente' : '✅ Reactivar cliente'}
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/clientes" style={outlineBtnStyle}>Cancelar</Link>
                <button type="submit" disabled={saving} style={primaryBtnStyle}>{saving ? 'Guardando…' : '✓ Guardar Cambios'}</button>
              </div>
            </div>
          </form>
        </FormCard>
      </motion.div>
    </div>
  )
}
