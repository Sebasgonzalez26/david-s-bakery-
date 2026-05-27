import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Plus } from 'lucide-react'
import { finanzasService } from '../../services/finanzasService'
import { FormCard, FormGroup, inputStyle, primaryBtnStyle, errorAlertStyle } from '../../components/FormShared'
import type { Transaccion, ResumenFinanciero } from '../../types'

const fmt = (n: number) => '₡' + n.toLocaleString('es-CR')
const fmtDate = (s: string) => new Date(s).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })
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
    Promise.all([finanzasService.getResumen(mes, anio), finanzasService.getAll()])
      .then(([rRes, tRes]) => { setResumen(rRes.data); setTransacciones(tRes.data); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { cargar() }, [mes, anio])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.descripcion || !form.monto || !form.fecha) { setError('Todos los campos son requeridos.'); return }
    setSaving(true)
    try { await finanzasService.create({ tipo: form.tipo, descripcion: form.descripcion, monto: Number(form.monto), fecha: form.fecha, categoria: form.categoria }); setShowForm(false); setForm({ tipo: 'Ingreso', descripcion: '', monto: '', fecha: now.toISOString().split('T')[0], categoria: '' }); setError(''); cargar() }
    catch { setError('Error al guardar.') } finally { setSaving(false) }
  }

  const filtradas = transacciones
    .filter(t => { const d = new Date(t.fecha); return d.getMonth() + 1 === mes && d.getFullYear() === anio })
    .sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400, color: 'hsl(var(--foreground))', letterSpacing: -0.5, lineHeight: 1, marginBottom: 5 }}>Finanzas</h1>
          <p style={{ fontSize: 13, color: 'hsl(var(--muted-fg))' }}>Ingresos, gastos y balance mensual</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: showForm ? 'hsl(var(--muted))' : 'hsl(var(--foreground))', color: showForm ? 'hsl(var(--foreground))' : '#fff', border: 'none', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
          <Plus size={14} /> {showForm ? 'Cancelar' : 'Nueva Transacción'}
        </button>
      </motion.div>

      {/* Selector mes/año */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
        style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        <select style={{ ...inputStyle, width: 'auto', borderRadius: 100 }} value={mes} onChange={e => setMes(Number(e.target.value))}>
          {MESES.map((m,i) => <option key={i+1} value={i+1}>{m}</option>)}
        </select>
        <select style={{ ...inputStyle, width: 'auto', borderRadius: 100 }} value={anio} onChange={e => setAnio(Number(e.target.value))}>
          {[2024,2025,2026].map(a => <option key={a}>{a}</option>)}
        </select>
      </motion.div>

      {/* KPIs */}
      {resumen && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Ingresos', value: resumen.totalIngresos, color: '#28825a', icon: <TrendingUp size={15} />, bg: 'rgba(40,130,90,0.08)' },
            { label: 'Gastos',   value: resumen.totalGastos,   color: '#b42a2a', icon: <TrendingDown size={15} />, bg: 'rgba(180,42,42,0.08)' },
            { label: 'Balance',  value: resumen.balanceNeto,   color: resumen.balanceNeto >= 0 ? '#28825a' : '#b42a2a', icon: <TrendingUp size={15} />, bg: resumen.balanceNeto >= 0 ? 'rgba(40,130,90,0.08)' : 'rgba(180,42,42,0.08)' },
          ].map((k,i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 14, padding: '20px 22px', boxShadow: 'var(--shadow-card)', transition: 'box-shadow 0.18s, transform 0.18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-card)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', color: 'hsl(var(--muted-fg))' }}>{k.label}</span>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>{k.icon}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400, color: k.color, letterSpacing: -0.5, lineHeight: 1 }}>{fmt(k.value)}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ maxWidth: 520, marginBottom: 20 }}>
          <FormCard title="Nueva Transacción">
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {error && <div style={errorAlertStyle}>{error}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Tipo">
                  <select style={inputStyle} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                    <option>Ingreso</option><option>Gasto</option>
                  </select>
                </FormGroup>
                <FormGroup label="Monto (₡) *">
                  <input type="number" min="0" step="100" style={inputStyle} value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} />
                </FormGroup>
              </div>
              <FormGroup label="Descripción *">
                <input style={inputStyle} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              </FormGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Fecha *">
                  <input type="date" style={inputStyle} value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} />
                </FormGroup>
                <FormGroup label="Categoría">
                  <input style={inputStyle} placeholder="Ingredientes, ventas…" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} />
                </FormGroup>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving} style={primaryBtnStyle}>{saving ? 'Guardando…' : '✓ Registrar'}</button>
              </div>
            </form>
          </FormCard>
        </motion.div>
      )}

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.14 }}>
        <div style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 20px' }}><div style={{ width: 28, height: 28, border: '2px solid hsl(var(--border))', borderTopColor: 'hsl(var(--accent))', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
          ) : filtradas.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 20px', gap: 10, color: 'hsl(var(--muted-fg))' }}>
              <TrendingUp size={32} strokeWidth={1} /><span style={{ fontSize: 13 }}>Sin transacciones este mes</span>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid hsl(var(--muted))' }}>
                  {['Descripción', 'Categoría', 'Tipo', 'Fecha', 'Monto'].map(h => (
                    <th key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.7, textTransform: 'uppercase', color: 'hsl(var(--muted-fg))', textAlign: 'left', padding: '11px 18px', opacity: 0.7 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtradas.map((t, i) => (
                  <tr key={t.id}
                    style={{ borderBottom: i < filtradas.length - 1 ? '1px solid hsl(var(--muted))' : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'hsl(var(--secondary))')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))' }}>{t.descripcion}</td>
                    <td style={{ padding: '13px 18px' }}>
                      {t.categoria
                        ? <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-fg))' }}>{t.categoria}</span>
                        : <span style={{ color: 'hsl(var(--border))', fontSize: 13 }}>—</span>}
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: t.tipo === 'Ingreso' ? 'rgba(40,130,90,0.08)' : 'rgba(180,42,42,0.08)', color: t.tipo === 'Ingreso' ? '#28825a' : '#b42a2a' }}>
                        {t.tipo === 'Ingreso' ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {t.tipo}
                      </span>
                    </td>
                    <td style={{ padding: '13px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{fmtDate(t.fecha)}</td>
                    <td style={{ padding: '13px 18px', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 400, color: t.tipo === 'Ingreso' ? '#28825a' : '#b42a2a' }}>
                      {t.tipo === 'Gasto' ? '-' : ''}{fmt(t.monto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  )
}
