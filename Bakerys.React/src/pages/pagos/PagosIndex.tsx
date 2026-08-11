import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Plus, Pencil, X, Check } from 'lucide-react'
import { pagoService } from '../../services/pagoService'
import { pedidoService } from '../../services/pedidoService'
import { FormCard, FormGroup, inputStyle, primaryBtnStyle, errorAlertStyle } from '../../components/FormShared'
import type { Pago, Pedido } from '../../types'

const fmt = (n: number) => '₡' + n.toLocaleString('es-CR')
const fmtDate = (s: string) => new Date(s).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })

type EditState = { id: number; monto: string; tipoPago: string; notas: string }

export default function PagosIndex() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ pedidoId: 0, monto: '', tipoPago: 'Adelanto', notas: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [busquedaPedido, setBusquedaPedido] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [editando, setEditando] = useState<EditState | null>(null)
  const [editError, setEditError] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  const cargar = () => {
    setLoading(true)
    pagoService.getAll()
      .then(pRes => setPagos(pRes.data))
      .catch(() => setPagos([]))
    pedidoService.getAll()
      .then(oRes => setPedidos(oRes.data.filter(p => p.estado !== 'Cancelado' && p.saldoPendiente > 0)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(() => { cargar() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.pedidoId || !form.monto) { setError('Seleccione pedido e ingrese monto.'); return }
    setSaving(true)
    try {
      await pagoService.create({ pedidoId: form.pedidoId, monto: Number(form.monto), tipoPago: form.tipoPago, notas: form.notas })
      setShowForm(false); setForm({ pedidoId: 0, monto: '', tipoPago: 'Adelanto', notas: '' }); setError('')
      setBusquedaPedido('')
      cargar()
    } catch { setError('Error al registrar el pago.') }
    finally { setSaving(false) }
  }

  const handleEditar = (p: Pago) => {
    setEditando({ id: p.id, monto: String(p.monto), tipoPago: p.metodoPago, notas: p.notas ?? '' })
    setEditError('')
  }

  const handleGuardarEdicion = async () => {
    if (!editando || !editando.monto) { setEditError('Ingresá un monto válido.'); return }
    setEditSaving(true)
    setEditError('')
    try {
      await pagoService.update(editando.id, { monto: Number(editando.monto), tipoPago: editando.tipoPago, notas: editando.notas })
      setEditando(null)
      cargar()
    } catch (err: any) {
      setEditError(err?.response?.data || 'Error al guardar.')
    } finally {
      setEditSaving(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400, color: 'hsl(var(--foreground))', letterSpacing: -0.5, lineHeight: 1, marginBottom: 5 }}>Pagos</h1>
          <p style={{ fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{pagos.length} pagos registrados</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError('') }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: showForm ? 'hsl(var(--muted))' : 'hsl(var(--foreground))', color: showForm ? 'hsl(var(--foreground))' : '#fff', border: 'none', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
          <Plus size={14} /> {showForm ? 'Cancelar' : 'Registrar Pago'}
        </button>
      </motion.div>

      {/* Form nuevo pago */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ maxWidth: 520, marginBottom: 24 }}>
          <FormCard title="Nuevo Pago">
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {error && <div style={errorAlertStyle}>{error}</div>}
              <FormGroup label="Pedido *">
                <div style={{ position: 'relative' }}>
                  <input
                    style={{ ...inputStyle, cursor: 'text' }}
                    placeholder="Buscar por nombre o #pedido…"
                    value={busquedaPedido}
                    onChange={e => { setBusquedaPedido(e.target.value); setShowDropdown(true); setForm({ ...form, pedidoId: 0 }) }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    autoComplete="off"
                  />
                  {showDropdown && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 100, maxHeight: 220, overflowY: 'auto', marginTop: 4 }}>
                      {pedidos
                        .filter(p => { const q = busquedaPedido.toLowerCase(); return !q || p.cliente.toLowerCase().includes(q) || String(p.id).includes(q) })
                        .map(p => (
                          <div key={p.id}
                            onMouseDown={() => { setForm({ ...form, pedidoId: p.id }); setBusquedaPedido(`#${p.id} — ${p.cliente}`); setShowDropdown(false) }}
                            style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid hsl(var(--muted))', color: 'hsl(var(--foreground))' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'hsl(var(--secondary))')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span style={{ fontWeight: 600 }}>#{p.id}</span> — {p.cliente}
                            <span style={{ float: 'right', color: '#b42a2a', fontWeight: 500 }}>{fmt(p.saldoPendiente)}</span>
                          </div>
                        ))}
                      {pedidos.filter(p => { const q = busquedaPedido.toLowerCase(); return !q || p.cliente.toLowerCase().includes(q) || String(p.id).includes(q) }).length === 0 && (
                        <div style={{ padding: '12px 14px', fontSize: 13, color: 'hsl(var(--muted-fg))', textAlign: 'center' }}>Sin resultados</div>
                      )}
                    </div>
                  )}
                </div>
              </FormGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Monto (₡) *">
                  <input type="number" min="0.01" step="any" style={inputStyle} value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} />
                </FormGroup>
                <FormGroup label="Tipo de pago">
                  <select style={inputStyle} value={form.tipoPago} onChange={e => setForm({ ...form, tipoPago: e.target.value })}>
                    {['Adelanto', 'Abono', 'Saldo Total'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </FormGroup>
              </div>
              <FormGroup label="Notas">
                <input style={inputStyle} value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} />
              </FormGroup>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving} style={primaryBtnStyle}>{saving ? 'Guardando…' : '✓ Registrar'}</button>
              </div>
            </form>
          </FormCard>
        </motion.div>
      )}

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
        <div style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 20px' }}>
              <div style={{ width: 28, height: 28, border: '2px solid hsl(var(--border))', borderTopColor: 'hsl(var(--accent))', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : pagos.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 20px', gap: 10, color: 'hsl(var(--muted-fg))' }}>
              <CreditCard size={32} strokeWidth={1} /><span style={{ fontSize: 13 }}>No hay pagos registrados</span>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid hsl(var(--muted))' }}>
                  {['#', 'Cliente', 'Pedido', 'Monto', 'Método', 'Fecha', ''].map(h => (
                    <th key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.7, textTransform: 'uppercase', color: 'hsl(var(--muted-fg))', textAlign: 'left', padding: '11px 18px', opacity: 0.7 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...pagos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map((p, i) => {
                  const esEditando = editando?.id === p.id
                  return (
                    <tr key={p.id}
                      style={{ borderBottom: i < pagos.length - 1 ? '1px solid hsl(var(--muted))' : 'none', background: esEditando ? 'hsl(var(--secondary))' : 'transparent', transition: 'background 0.1s' }}
                      onMouseEnter={e => { if (!esEditando) e.currentTarget.style.background = 'hsl(var(--secondary))' }}
                      onMouseLeave={e => { if (!esEditando) e.currentTarget.style.background = 'transparent' }}
                    >
                      <td style={{ padding: '13px 18px', fontSize: 12, color: 'hsl(var(--muted-fg))' }}>#{p.id}</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))' }}>{p.clienteNombre}</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>Pedido #{p.pedidoId}</td>

                      {esEditando ? (
                        <>
                          <td style={{ padding: '8px 18px' }}>
                            <input
                              type="number" min="0.01" step="any"
                              style={{ ...inputStyle, width: 110, padding: '6px 10px', fontSize: 13 }}
                              value={editando.monto}
                              onChange={e => setEditando({ ...editando, monto: e.target.value })}
                              autoFocus
                            />
                          </td>
                          <td style={{ padding: '8px 18px' }}>
                            <select
                              style={{ ...inputStyle, fontSize: 12, padding: '6px 10px' }}
                              value={editando.tipoPago}
                              onChange={e => setEditando({ ...editando, tipoPago: e.target.value })}
                            >
                              {['Adelanto', 'Abono', 'Saldo Total'].map(m => <option key={m}>{m}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: '8px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{fmtDate(p.fecha)}</td>
                          <td style={{ padding: '8px 18px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {editError && <span style={{ fontSize: 11, color: '#b42a2a' }}>{editError}</span>}
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={handleGuardarEdicion} disabled={editSaving}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, border: 'none', background: 'hsl(var(--foreground))', color: '#fff', cursor: 'pointer' }}>
                                  <Check size={12} /> {editSaving ? '…' : 'Guardar'}
                                </button>
                                <button onClick={() => { setEditando(null); setEditError('') }}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 100, fontSize: 12, border: '1px solid hsl(var(--border))', background: '#fff', color: 'hsl(var(--muted-fg))', cursor: 'pointer' }}>
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '13px 18px', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 400, color: '#28825a' }}>{fmt(p.monto)}</td>
                          <td style={{ padding: '13px 18px' }}>
                            <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}>{p.metodoPago}</span>
                          </td>
                          <td style={{ padding: '13px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{fmtDate(p.fecha)}</td>
                          <td style={{ padding: '13px 18px' }}>
                            <button onClick={() => handleEditar(p)}
                              title="Editar pago"
                              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: '1px solid hsl(var(--border))', borderRadius: '50%', background: '#fff', color: 'hsl(var(--muted-fg))', cursor: 'pointer', transition: 'all 0.12s' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'hsl(var(--secondary))'; (e.currentTarget as HTMLElement).style.color = 'hsl(var(--foreground))' }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = 'hsl(var(--muted-fg))' }}
                            >
                              <Pencil size={12} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  )
}
