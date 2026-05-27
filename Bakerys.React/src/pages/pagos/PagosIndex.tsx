import { useEffect, useState } from 'react'
import { pagoService } from '../../services/pagoService'
import { pedidoService } from '../../services/pedidoService'
import type { Pago, Pedido } from '../../types'

const fmtMoney = (n: number) => '₡' + n.toLocaleString('es-CR')
const fmtDate  = (s: string) => new Date(s).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })

export default function PagosIndex() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ pedidoId: 0, monto: '', metodoPago: 'Efectivo', notas: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const cargar = () => {
    Promise.all([pagoService.getAll(), pedidoService.getAll()]).then(([pRes, oRes]) => {
      setPagos(pRes.data)
      setPedidos(oRes.data.filter(p => p.estado !== 'Cancelado' && p.saldoPendiente > 0))
      setLoading(false)
    })
  }
  useEffect(() => { cargar() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.pedidoId || !form.monto) { setError('Seleccione pedido e ingrese monto.'); return }
    setSaving(true)
    try {
      await pagoService.create({ pedidoId: form.pedidoId, monto: Number(form.monto), metodoPago: form.metodoPago, notas: form.notas })
      setShowForm(false)
      setForm({ pedidoId: 0, monto: '', metodoPago: 'Efectivo', notas: '' })
      setError('')
      cargar()
    } catch {
      setError('Error al registrar el pago.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={pageTitle}>Pagos</h1>
          <p style={pageSub}>Registro de pagos recibidos</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={primaryBtnStyle}>
          {showForm ? '✕ Cancelar' : '+ Registrar Pago'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ maxWidth: 520, marginBottom: 24 }}>
          <div style={cardStyle}>
            <div style={cardHeader}><span style={cardTitle}>💳 Nuevo Pago</span></div>
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {error && <div style={errorStyle}>{error}</div>}
              <FormGroup label="Pedido *">
                <select style={inputStyle} value={form.pedidoId}
                  onChange={e => setForm({ ...form, pedidoId: Number(e.target.value) })}>
                  <option value={0}>Seleccionar pedido…</option>
                  {pedidos.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.id} — {p.cliente} (saldo: {fmtMoney(p.saldoPendiente)})
                    </option>
                  ))}
                </select>
              </FormGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Monto (₡) *">
                  <input type="number" min="0" step="100" style={inputStyle} value={form.monto}
                    onChange={e => setForm({ ...form, monto: e.target.value })} />
                </FormGroup>
                <FormGroup label="Método de Pago">
                  <select style={inputStyle} value={form.metodoPago}
                    onChange={e => setForm({ ...form, metodoPago: e.target.value })}>
                    {['Efectivo', 'SINPE', 'Transferencia', 'Tarjeta'].map(m =>
                      <option key={m} value={m}>{m}</option>
                    )}
                  </select>
                </FormGroup>
              </div>
              <FormGroup label="Notas">
                <input style={inputStyle} value={form.notas}
                  onChange={e => setForm({ ...form, notas: e.target.value })} />
              </FormGroup>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving} style={primaryBtnStyle}>
                  {saving ? 'Guardando…' : '✓ Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={cardStyle}>
        {loading ? (
          <div style={loadingStyle}>Cargando pagos…</div>
        ) : pagos.length === 0 ? (
          <div style={emptyStyle}><span style={{ fontSize: 32, marginBottom: 8 }}>💳</span><p>No hay pagos registrados</p></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--brown-100)' }}>
                {['#', 'Cliente', 'Pedido', 'Monto', 'Método', 'Fecha'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...pagos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < pagos.length - 1 ? '1px solid var(--brown-50)' : 'none' }}>
                  <td style={{ ...tdStyle, color: 'var(--brown-300)', fontSize: 12 }}>#{p.id}</td>
                  <td style={tdStyle}>{p.clienteNombre}</td>
                  <td style={{ ...tdStyle, color: 'var(--brown-400)' }}>Pedido #{p.pedidoId}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--green-600)' }}>
                    {fmtMoney(p.monto)}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: 'rgba(74,49,33,0.07)', color: 'var(--brown-600)' }}>
                      {p.metodoPago}
                    </span>
                  </td>
                  <td style={tdStyle}>{fmtDate(p.fecha)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
const primaryBtnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--brown-800)', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid var(--brown-200)', borderRadius: 10, fontSize: 13, color: 'var(--brown-800)', background: '#fff', outline: 'none', boxSizing: 'border-box' }
const thStyle: React.CSSProperties = { fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--brown-300)', textAlign: 'left', padding: '12px 16px' }
const tdStyle: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: 'var(--brown-600)' }
const errorStyle: React.CSSProperties = { background: 'rgba(201,64,64,0.08)', border: '1px solid rgba(201,64,64,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--red-500)', marginBottom: 18 }
const loadingStyle: React.CSSProperties = { padding: '60px 20px', textAlign: 'center', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--brown-300)' }
const emptyStyle: React.CSSProperties = { padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--brown-300)', fontSize: 13 }
