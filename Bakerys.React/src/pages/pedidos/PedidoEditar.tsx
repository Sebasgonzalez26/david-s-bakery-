import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { pedidoService } from '../../services/pedidoService'
import { clienteService } from '../../services/clienteService'
import { PageHeader, FormCard, FormGroup, inputStyle, primaryBtnStyle, outlineBtnStyle, errorAlertStyle } from '../../components/FormShared'
import type { Cliente } from '../../types'

export default function PedidoEditar() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [form, setForm] = useState({ clienteId: 0, notas: '', montoTotal: '', fechaEntrega: '', estado: 'Pendiente' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([pedidoService.getById(Number(id)), clienteService.getAll()]).then(([pRes, cRes]) => {
      const p = pRes.data
      setForm({ clienteId: p.clienteId, notas: p.notas ?? '', montoTotal: String(p.montoTotal), fechaEntrega: p.fechaEntrega.split('T')[0], estado: p.estado })
      setClientes(cRes.data.filter(c => c.activo))
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clienteId || !form.montoTotal || !form.fechaEntrega) { setError('Complete todos los campos requeridos.'); return }
    setSaving(true)
    try {
      await pedidoService.update(Number(id), { clienteId: form.clienteId, notas: form.notas, montoTotal: Number(form.montoTotal), fechaEntrega: form.fechaEntrega, estado: form.estado })
      navigate('/pedidos')
    } catch { setError('Error al guardar.'); setSaving(false) }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><div style={{ width: 28, height: 28, border: '2px solid hsl(var(--border))', borderTopColor: 'hsl(var(--accent))', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div>
      <PageHeader title="Editar Pedido" sub={`Modificar pedido #${id}`} backTo="/pedidos" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} style={{ maxWidth: 560 }}>
        <FormCard title="Datos del Pedido" idLabel={`ID: ${id}`}>
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {error && <div style={errorAlertStyle}>{error}</div>}
            <FormGroup label="Cliente *">
              <select style={inputStyle} value={form.clienteId} onChange={e => setForm({ ...form, clienteId: Number(e.target.value) })}>
                <option value={0}>Seleccionar cliente…</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} — {c.telefono}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Notas">
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} />
            </FormGroup>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <FormGroup label="Monto Total (₡) *">
                <input type="number" min="0" step="100" style={inputStyle} value={form.montoTotal} onChange={e => setForm({ ...form, montoTotal: e.target.value })} />
              </FormGroup>
              <FormGroup label="Fecha de Entrega *">
                <input type="date" style={inputStyle} value={form.fechaEntrega} onChange={e => setForm({ ...form, fechaEntrega: e.target.value })} />
              </FormGroup>
            </div>
            <FormGroup label="Estado">
              <select style={inputStyle} value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
                {['Pendiente','En Proceso','Listo','Entregado','Cancelado'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormGroup>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              <Link to="/pedidos" style={outlineBtnStyle}>Cancelar</Link>
              <button type="submit" disabled={saving} style={primaryBtnStyle}>{saving ? 'Guardando…' : '✓ Guardar Cambios'}</button>
            </div>
          </form>
        </FormCard>
      </motion.div>
    </div>
  )
}
