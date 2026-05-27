import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { pedidoService } from '../../services/pedidoService'
import { clienteService } from '../../services/clienteService'
import { PageHeader, FormCard, FormGroup, inputStyle, primaryBtnStyle, outlineBtnStyle, errorAlertStyle } from '../../components/FormShared'
import type { Cliente } from '../../types'

export default function PedidoAgregar() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [form, setForm] = useState({ clienteId: 0, descripcion: '', montoTotal: '', fechaEntrega: '', estado: 'Pendiente' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { clienteService.getAll().then(r => setClientes(r.data.filter(c => c.activo))) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clienteId || !form.descripcion || !form.montoTotal || !form.fechaEntrega) { setError('Complete todos los campos requeridos.'); return }
    setSaving(true)
    try {
      await pedidoService.create({ clienteId: form.clienteId, descripcion: form.descripcion, montoTotal: Number(form.montoTotal), fechaEntrega: form.fechaEntrega, estado: form.estado })
      navigate('/pedidos')
    } catch { setError('Error al guardar.'); setSaving(false) }
  }

  return (
    <div>
      <PageHeader title="Nuevo Pedido" sub="Crear un pedido para un cliente" backTo="/pedidos" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} style={{ maxWidth: 560 }}>
        <FormCard title="Datos del Pedido">
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {error && <div style={errorAlertStyle}>{error}</div>}
            <FormGroup label="Cliente *">
              <select style={inputStyle} value={form.clienteId} onChange={e => setForm({ ...form, clienteId: Number(e.target.value) })}>
                <option value={0}>Seleccionar cliente…</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} — {c.telefono}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Descripción *">
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
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
              <button type="submit" disabled={saving} style={primaryBtnStyle}>{saving ? 'Guardando…' : '✓ Crear Pedido'}</button>
            </div>
          </form>
        </FormCard>
      </motion.div>
    </div>
  )
}
