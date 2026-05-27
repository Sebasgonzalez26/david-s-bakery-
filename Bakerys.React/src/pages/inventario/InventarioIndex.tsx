import { useEffect, useState } from 'react'
import { inventarioService } from '../../services/inventarioService'
import type { Producto, MovimientoInventario } from '../../types'

export default function InventarioIndex() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'productos' | 'movimientos'>('productos')
  const [showProdForm, setShowProdForm] = useState(false)
  const [showMovForm, setShowMovForm] = useState(false)
  const [prodForm, setProdForm] = useState({ nombre: '', unidadMedida: '', stockActual: '', stockMinimo: '' })
  const [movForm, setMovForm] = useState({ productoId: 0, tipoMovimiento: 'Entrada', cantidad: '', notas: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const cargar = () => {
    Promise.all([inventarioService.getAll(), inventarioService.getMovimientos()]).then(([pRes, mRes]) => {
      setProductos(pRes.data)
      setMovimientos(mRes.data)
      setLoading(false)
    })
  }
  useEffect(() => { cargar() }, [])

  const handleProdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prodForm.nombre || !prodForm.unidadMedida) { setError('Nombre y unidad son requeridos.'); return }
    setSaving(true)
    try {
      await inventarioService.create({
        nombre: prodForm.nombre,
        unidadMedida: prodForm.unidadMedida,
        stockActual: Number(prodForm.stockActual),
        stockMinimo: Number(prodForm.stockMinimo),
      })
      setProdForm({ nombre: '', unidadMedida: '', stockActual: '', stockMinimo: '' })
      setShowProdForm(false)
      setError('')
      cargar()
    } catch { setError('Error al guardar el producto.') }
    finally { setSaving(false) }
  }

  const handleMovSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!movForm.productoId || !movForm.cantidad) { setError('Seleccione producto e ingrese cantidad.'); return }
    setSaving(true)
    try {
      await inventarioService.registrarMovimiento({
        productoId: movForm.productoId,
        tipoMovimiento: movForm.tipoMovimiento,
        cantidad: Number(movForm.cantidad),
        notas: movForm.notas,
      })
      setMovForm({ productoId: 0, tipoMovimiento: 'Entrada', cantidad: '', notas: '' })
      setShowMovForm(false)
      setError('')
      cargar()
    } catch { setError('Error al registrar el movimiento.') }
    finally { setSaving(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={pageTitle}>Inventario</h1>
          <p style={pageSub}>Productos, stock y movimientos</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setShowMovForm(!showMovForm); setShowProdForm(false) }} style={outlineBtnStyle}>
            {showMovForm ? '✕' : '+ Movimiento'}
          </button>
          <button onClick={() => { setShowProdForm(!showProdForm); setShowMovForm(false) }} style={primaryBtnStyle}>
            {showProdForm ? '✕' : '+ Producto'}
          </button>
        </div>
      </div>

      {/* Formulario producto */}
      {showProdForm && (
        <div style={{ maxWidth: 520, marginBottom: 24 }}>
          <div style={cardStyle}>
            <div style={cardHeader}><span style={cardTitle}>📦 Nuevo Producto</span></div>
            <form onSubmit={handleProdSubmit} style={{ padding: '24px' }}>
              {error && <div style={errorStyle}>{error}</div>}
              <FormGroup label="Nombre *">
                <input style={inputStyle} value={prodForm.nombre}
                  onChange={e => setProdForm({ ...prodForm, nombre: e.target.value })} />
              </FormGroup>
              <FormGroup label="Unidad de Medida *">
                <input style={inputStyle} placeholder="kg, litros, unidades…" value={prodForm.unidadMedida}
                  onChange={e => setProdForm({ ...prodForm, unidadMedida: e.target.value })} />
              </FormGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Stock Actual">
                  <input type="number" min="0" style={inputStyle} value={prodForm.stockActual}
                    onChange={e => setProdForm({ ...prodForm, stockActual: e.target.value })} />
                </FormGroup>
                <FormGroup label="Stock Mínimo">
                  <input type="number" min="0" style={inputStyle} value={prodForm.stockMinimo}
                    onChange={e => setProdForm({ ...prodForm, stockMinimo: e.target.value })} />
                </FormGroup>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving} style={primaryBtnStyle}>
                  {saving ? 'Guardando…' : '✓ Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulario movimiento */}
      {showMovForm && (
        <div style={{ maxWidth: 520, marginBottom: 24 }}>
          <div style={cardStyle}>
            <div style={cardHeader}><span style={cardTitle}>🔄 Registrar Movimiento</span></div>
            <form onSubmit={handleMovSubmit} style={{ padding: '24px' }}>
              {error && <div style={errorStyle}>{error}</div>}
              <FormGroup label="Producto *">
                <select style={inputStyle} value={movForm.productoId}
                  onChange={e => setMovForm({ ...movForm, productoId: Number(e.target.value) })}>
                  <option value={0}>Seleccionar producto…</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} (stock: {p.stockActual} {p.unidadMedida})</option>
                  ))}
                </select>
              </FormGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Tipo">
                  <select style={inputStyle} value={movForm.tipoMovimiento}
                    onChange={e => setMovForm({ ...movForm, tipoMovimiento: e.target.value })}>
                    <option value="Entrada">Entrada</option>
                    <option value="Salida">Salida</option>
                  </select>
                </FormGroup>
                <FormGroup label="Cantidad *">
                  <input type="number" min="0" step="0.01" style={inputStyle} value={movForm.cantidad}
                    onChange={e => setMovForm({ ...movForm, cantidad: e.target.value })} />
                </FormGroup>
              </div>
              <FormGroup label="Notas">
                <input style={inputStyle} value={movForm.notas}
                  onChange={e => setMovForm({ ...movForm, notas: e.target.value })} />
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {(['productos', 'movimientos'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 500,
            border: tab === t ? 'none' : '1px solid var(--brown-200)',
            background: tab === t ? 'var(--brown-800)' : '#fff',
            color: tab === t ? '#fff' : 'var(--brown-500)',
            cursor: 'pointer',
          }}>
            {t === 'productos' ? '📦 Productos' : '🔄 Movimientos'}
          </button>
        ))}
      </div>

      {/* Tabla productos */}
      {tab === 'productos' && (
        <div style={cardStyle}>
          {loading ? (
            <div style={loadingStyle}>Cargando…</div>
          ) : productos.length === 0 ? (
            <div style={emptyStyle}><span style={{ fontSize: 32, marginBottom: 8 }}>📦</span><p>Sin productos registrados</p></div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--brown-100)' }}>
                  {['Producto', 'Stock Actual', 'Stock Mínimo', 'Unidad', 'Estado'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productos.map((p, i) => {
                  const pct = p.stockMinimo > 0 ? Math.min((p.stockActual / p.stockMinimo) * 100, 100) : 100
                  const bajo = p.stockActual <= p.stockMinimo
                  return (
                    <tr key={p.id} style={{ borderBottom: i < productos.length - 1 ? '1px solid var(--brown-50)' : 'none' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--brown-800)' }}>{p.nombre}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', color: bajo ? 'var(--red-500)' : 'var(--brown-800)' }}>
                          {p.stockActual}
                        </div>
                        <div style={{ height: 3, width: 60, background: 'var(--brown-100)', borderRadius: 2, marginTop: 4 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: bajo ? 'var(--red-400)' : 'var(--green-500)', borderRadius: 2 }} />
                        </div>
                      </td>
                      <td style={tdStyle}>{p.stockMinimo}</td>
                      <td style={tdStyle}>{p.unidadMedida}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: bajo ? 'rgba(201,64,64,0.1)' : 'rgba(74,158,107,0.1)', color: bajo ? 'var(--red-500)' : 'var(--green-600)' }}>
                          {bajo ? '⚠️ Stock bajo' : '✅ OK'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tabla movimientos */}
      {tab === 'movimientos' && (
        <div style={cardStyle}>
          {loading ? (
            <div style={loadingStyle}>Cargando…</div>
          ) : movimientos.length === 0 ? (
            <div style={emptyStyle}><span style={{ fontSize: 32, marginBottom: 8 }}>🔄</span><p>Sin movimientos registrados</p></div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--brown-100)' }}>
                  {['Producto', 'Tipo', 'Cantidad', 'Fecha', 'Notas'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...movimientos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map((m, i) => (
                  <tr key={m.id} style={{ borderBottom: i < movimientos.length - 1 ? '1px solid var(--brown-50)' : 'none' }}>
                    <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--brown-800)' }}>{m.productoNombre}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: m.tipoMovimiento === 'Entrada' ? 'rgba(74,158,107,0.1)' : 'rgba(201,64,64,0.1)', color: m.tipoMovimiento === 'Entrada' ? 'var(--green-600)' : 'var(--red-500)' }}>
                        {m.tipoMovimiento === 'Entrada' ? '↓' : '↑'} {m.tipoMovimiento}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{m.cantidad}</td>
                    <td style={tdStyle}>{new Date(m.fecha).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td style={{ ...tdStyle, color: 'var(--brown-300)' }}>{m.notas || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
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
const outlineBtnStyle: React.CSSProperties = { border: '1px solid var(--brown-200)', borderRadius: 100, padding: '9px 18px', fontSize: 13, fontWeight: 500, color: 'var(--brown-600)', background: '#fff', cursor: 'pointer' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid var(--brown-200)', borderRadius: 10, fontSize: 13, color: 'var(--brown-800)', background: '#fff', outline: 'none', boxSizing: 'border-box' }
const thStyle: React.CSSProperties = { fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--brown-300)', textAlign: 'left', padding: '12px 16px' }
const tdStyle: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: 'var(--brown-600)' }
const errorStyle: React.CSSProperties = { background: 'rgba(201,64,64,0.08)', border: '1px solid rgba(201,64,64,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--red-500)', marginBottom: 18 }
const loadingStyle: React.CSSProperties = { padding: '60px 20px', textAlign: 'center', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--brown-300)' }
const emptyStyle: React.CSSProperties = { padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--brown-300)', fontSize: 13 }
