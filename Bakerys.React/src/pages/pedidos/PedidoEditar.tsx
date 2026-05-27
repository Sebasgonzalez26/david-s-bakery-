import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { pedidoService } from '../../services/pedidoService'
import { clienteService } from '../../services/clienteService'
import type { Cliente } from '../../types'

export default function PedidoEditar() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [form, setForm] = useState({
    clienteId: 0, descripcion: '', montoTotal: '', fechaEntrega: '', estado: 'Pendiente',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      pedidoService.getById(Number(id)),
      clienteService.getAll(),
    ]).then(([pRes, cRes]) => {
      const p = pRes.data
      setForm({
        clienteId: p.clienteId,
        descripcion: p.descripcion,
        montoTotal: String(p.montoTotal),
        fechaEntrega: p.fechaEntrega.split('T')[0],
        estado: p.estado,
      })
      setClientes(cRes.data.filter(c => c.activo))
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clienteId || !form.descripcion.trim() || !form.montoTotal || !form.fechaEntrega) {
      setError('Todos los campos obligatorios deben completarse.')
      return
    }
    setSaving(true)
    try {
      await pedidoService.update(Number(id), {
        clienteId: form.clienteId,
        descripcion: form.descripcion,
        montoTotal: Number(form.montoTotal),
        fechaEntrega: form.fechaEntrega,
        estado: form.estado,
      })
      navigate('/pedidos')
    } catch {
      setError('Error al guardar.')
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: 60, textAlign: 'center', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--brown-300)' }}>Cargando…</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={pageTitle}>Editar Pedido</h1>
          <p style={pageSub}>Modificar pedido #{id}</p>
        </div>
        <Link to="/pedidos" style={outlineBtnStyle}>← Volver</Link>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div style={cardStyle}>
          <div style={cardHeader}>
            <span style={cardTitle}>📋 Datos del Pedido</span>
            <span style={{ fontSize: 12, color: 'var(--brown-300)', marginLeft: 'auto' }}>ID: {id}</span>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {error && <div style={errorStyle}>{error}</div>}

            <FormGroup label="Cliente *">
              <select style={inputStyle} value={form.clienteId}
                onChange={e => setForm({ ...form, clienteId: Number(e.target.value) })}>
                <option value={0}>Seleccionar cliente…</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} — {c.telefono}</option>)}
              </select>
            </FormGroup>

            <FormGroup label="Descripción *">
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <FormGroup label="Monto Total (₡) *">
                <input type="number" min="0" step="100" style={inputStyle} value={form.montoTotal}
                  onChange={e => setForm({ ...form, montoTotal: e.target.value })} />
              </FormGroup>
              <FormGroup label="Fecha de Entrega *">
                <input type="date" style={inputStyle} value={form.fechaEntrega}
                  onChange={e => setForm({ ...form, fechaEntrega: e.target.value })} />
              </FormGroup>
            </div>

            <FormGroup label="Estado">
              <select style={inputStyle} value={form.estado}
                onChange={e => setForm({ ...form, estado: e.target.value })}>
                {['Pendiente', 'En Proceso', 'Listo', 'Entregado', 'Cancelado'].map(s =>
                  <option key={s} value={s}>{s}</option>
                )}
              </select>
            </FormGroup>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <Link to="/pedidos" style={outlineBtnStyle}>Cancelar</Link>
              <button type="submit" disabled={saving} style={primaryBtnStyle}>
                {saving ? 'Guardando…' : '✓ Guardar Cambios'}
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
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--brown-600)', marginBottom: 6 }}>{label}</label>
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
