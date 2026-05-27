import { useEffect, useState } from 'react'
import { finanzasService } from '../../services/finanzasService'
import type { Transaccion, ResumenFinanciero } from '../../types'

const fmtMoney = (n: number) => '₡' + n.toLocaleString('es-CR')
const fmtDate  = (s: string) => new Date(s).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function FinanzasIndex() {
  const now = new Date()
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [anio, setAnio] = useState(now.getFullYear())
  const [resumen, setResumen] = useState<ResumenFinanciero | null>(null)
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ tipo: 'Ingreso', descripcion: '', monto: '', fecha: now.toISOString().split('T')[0], categoria: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const cargar = () => {
    setLoading(true)
    Promise.all([
      finanzasService.getResumen(mes, anio),
      finanzasService.getAll(),
    ]).then(([rRes, tRes]) => {
      setResumen(rRes.data)
      setTransacciones(tRes.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [mes, anio])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.descripcion || !form.monto || !form.fecha) { setError('Todos los campos son requeridos.'); return }
    setSaving(true)
    try {
      await finanzasService.create({
        tipo: form.tipo,
        descripcion: form.descripcion,
        monto: Number(form.monto),
        fecha: form.fecha,
        categoria: form.categoria,
      })
      setShowForm(false)
      setForm({ tipo: 'Ingreso', descripcion: '', monto: '', fecha: now.toISOString().split('T')[0], categoria: '' })
      setError('')
      cargar()
    } catch { setError('Error al guardar.') }
    finally { setSaving(false) }
  }

  const filtradas = transacciones.filter(t => {
    const d = new Date(t.fecha)
    return d.getMonth() + 1 === mes && d.getFullYear() === anio
  }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={pageTitle}>Finanzas</h1>
          <p style={pageSub}>Ingresos, gastos y balance</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={primaryBtnStyle}>
          {showForm ? '✕ Cancelar' : '+ Nueva Transacción'}
        </button>
      </div>

      {/* Selector mes/año */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' }}>
        <select style={{ ...inputStyle, width: 'auto' }} value={mes} onChange={e => setMes(Number(e.target.value))}>
          {MESES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
        </select>
        <select style={{ ...inputStyle, width: 'auto' }} value={anio} onChange={e => setAnio(Number(e.target.value))}>
          {[2024, 2025, 2026].map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* KPIs */}
      {resumen && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Ingresos', value: resumen.totalIngresos, color: 'var(--green-600)', icon: '↑' },
            { label: 'Gastos', value: resumen.totalGastos, color: 'var(--red-500)', icon: '↓' },
            { label: 'Balance Neto', value: resumen.balanceNeto, color: resumen.balanceNeto >= 0 ? 'var(--green-600)' : 'var(--red-500)', icon: '=' },
          ].map((k, i) => (
            <div key={i} style={{ ...cardStyle, padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--brown-400)', fontWeight: 500 }}>{k.label}</span>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(74,49,33,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: k.color }}>{k.icon}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 500, color: k.color, letterSpacing: -1 }}>
                {fmtMoney(k.value)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ maxWidth: 520, marginBottom: 24 }}>
          <div style={cardStyle}>
            <div style={cardHeader}><span style={cardTitle}>💰 Nueva Transacción</span></div>
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {error && <div style={errorStyle}>{error}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Tipo">
                  <select style={inputStyle} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                    <option value="Ingreso">Ingreso</option>
                    <option value="Gasto">Gasto</option>
                  </select>
                </FormGroup>
                <FormGroup label="Monto (₡) *">
                  <input type="number" min="0" step="100" style={inputStyle} value={form.monto}
                    onChange={e => setForm({ ...form, monto: e.target.value })} />
                </FormGroup>
              </div>
              <FormGroup label="Descripción *">
                <input style={inputStyle} value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              </FormGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Fecha *">
                  <input type="date" style={inputStyle} value={form.fecha}
                    onChange={e => setForm({ ...form, fecha: e.target.value })} />
                </FormGroup>
                <FormGroup label="Categoría">
                  <input style={inputStyle} placeholder="Ingredientes, ventas…" value={form.categoria}
                    onChange={e => setForm({ ...form, categoria: e.target.value })} />
                </FormGroup>
              </div>
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
          <div style={loadingStyle}>Cargando…</div>
        ) : filtradas.length === 0 ? (
          <div style={emptyStyle}><span style={{ fontSize: 32, marginBottom: 8 }}>💰</span><p>Sin transacciones este mes</p></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--brown-100)' }}>
                {['Descripción', 'Categoría', 'Tipo', 'Fecha', 'Monto'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < filtradas.length - 1 ? '1px solid var(--brown-50)' : 'none' }}>
                  <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--brown-800)' }}>{t.descripcion}</td>
                  <td style={tdStyle}>
                    {t.categoria ? (
                      <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: 'rgba(74,49,33,0.07)', color: 'var(--brown-500)' }}>
                        {t.categoria}
                      </span>
                    ) : <span style={{ color: 'var(--brown-200)' }}>—</span>}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: t.tipo === 'Ingreso' ? 'rgba(74,158,107,0.1)' : 'rgba(201,64,64,0.1)', color: t.tipo === 'Ingreso' ? 'var(--green-600)' : 'var(--red-500)' }}>
                      {t.tipo === 'Ingreso' ? '↑' : '↓'} {t.tipo}
                    </span>
                  </td>
                  <td style={tdStyle}>{fmtDate(t.fecha)}</td>
                  <td style={{ padding: '13px 16px', fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: 14, color: t.tipo === 'Ingreso' ? 'var(--green-600)' : 'var(--red-500)' }}>
                    {t.tipo === 'Gasto' ? '-' : ''}{fmtMoney(t.monto)}
                  </td>
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
const primaryBtnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--brown-800)', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }
const inputStyle: React.CSSProperties = { padding: '10px 14px', border: '1px solid var(--brown-200)', borderRadius: 10, fontSize: 13, color: 'var(--brown-800)', background: '#fff', outline: 'none', boxSizing: 'border-box' }
const thStyle: React.CSSProperties = { fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--brown-300)', textAlign: 'left', padding: '12px 16px' }
const tdStyle: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: 'var(--brown-600)' }
const errorStyle: React.CSSProperties = { background: 'rgba(201,64,64,0.08)', border: '1px solid rgba(201,64,64,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--red-500)', marginBottom: 18 }
const loadingStyle: React.CSSProperties = { padding: '60px 20px', textAlign: 'center', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--brown-300)' }
const emptyStyle: React.CSSProperties = { padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--brown-300)', fontSize: 13 }
