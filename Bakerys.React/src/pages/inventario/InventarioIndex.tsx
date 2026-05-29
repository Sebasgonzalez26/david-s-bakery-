import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, ArrowDownToLine, ArrowUpFromLine, Plus } from 'lucide-react'
import { inventarioService } from '../../services/inventarioService'
import { FormCard, FormGroup, inputStyle, primaryBtnStyle, outlineBtnStyle, errorAlertStyle } from '../../components/FormShared'
import type { Producto, MovimientoInventario } from '../../types'

export default function InventarioIndex() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'productos' | 'movimientos'>('productos')
  const [showProd, setShowProd] = useState(false)
  const [showMov, setShowMov] = useState(false)
  const [prodForm, setProdForm] = useState({ nombre: '', categoria: '', unidadMedida: '', stockActual: '', stockMinimo: '', precioUnitario: '' })
  const [movForm, setMovForm] = useState({ productoId: 0, tipoMovimiento: 'Entrada', cantidad: '', notas: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const cargar = () => {
    Promise.all([inventarioService.getAll(), inventarioService.getMovimientos()]).then(([pRes, mRes]) => {
      setProductos(pRes.data); setMovimientos(mRes.data); setLoading(false)
    })
  }
  useEffect(() => { cargar() }, [])

  const handleProd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prodForm.nombre || !prodForm.categoria || !prodForm.unidadMedida || !prodForm.precioUnitario) { setError('Nombre, categoría, unidad y precio son requeridos.'); return }
    setSaving(true)
    try { await inventarioService.create({ nombre: prodForm.nombre, categoria: prodForm.categoria, unidadMedida: prodForm.unidadMedida, stockActual: Number(prodForm.stockActual), stockMinimo: Number(prodForm.stockMinimo), precioUnitario: Number(prodForm.precioUnitario) }); setProdForm({ nombre: '', categoria: '', unidadMedida: '', stockActual: '', stockMinimo: '', precioUnitario: '' }); setShowProd(false); setError(''); cargar() }
    catch { setError('Error al guardar.') } finally { setSaving(false) }
  }

  const handleMov = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!movForm.productoId || !movForm.cantidad) { setError('Seleccione producto e ingrese cantidad.'); return }
    setSaving(true)
    try { await inventarioService.registrarMovimiento({ productoId: movForm.productoId, tipoMovimiento: movForm.tipoMovimiento, cantidad: Number(movForm.cantidad), notas: movForm.notas }); setMovForm({ productoId: 0, tipoMovimiento: 'Entrada', cantidad: '', notas: '' }); setShowMov(false); setError(''); cargar() }
    catch { setError('Error al registrar.') } finally { setSaving(false) }
  }

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400, color: 'hsl(var(--foreground))', letterSpacing: -0.5, lineHeight: 1, marginBottom: 5 }}>Inventario</h1>
          <p style={{ fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{productos.length} productos · {movimientos.length} movimientos</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setShowMov(!showMov); setShowProd(false) }} style={{ ...outlineBtnStyle, cursor: 'pointer' }}>
            Movimiento
          </button>
          <button onClick={() => { setShowProd(!showProd); setShowMov(false) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'hsl(var(--foreground))', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <Plus size={14} /> Producto
          </button>
        </div>
      </motion.div>

      {/* Form producto */}
      {showProd && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ maxWidth: 520, marginBottom: 20 }}>
          <FormCard title="Nuevo Producto">
            <form onSubmit={handleProd} style={{ padding: '24px' }}>
              {error && <div style={errorAlertStyle}>{error}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Nombre *"><input style={inputStyle} value={prodForm.nombre} onChange={e => setProdForm({ ...prodForm, nombre: e.target.value })} /></FormGroup>
                <FormGroup label="Categoría *"><input style={inputStyle} placeholder="Harinas, Lácteos…" value={prodForm.categoria} onChange={e => setProdForm({ ...prodForm, categoria: e.target.value })} /></FormGroup>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Unidad de Medida *"><input style={inputStyle} placeholder="kg, litros, unidades…" value={prodForm.unidadMedida} onChange={e => setProdForm({ ...prodForm, unidadMedida: e.target.value })} /></FormGroup>
                <FormGroup label="Precio Unitario (₡) *"><input type="number" min="0.01" step="50" style={inputStyle} value={prodForm.precioUnitario} onChange={e => setProdForm({ ...prodForm, precioUnitario: e.target.value })} /></FormGroup>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Stock Actual"><input type="number" min="0" style={inputStyle} value={prodForm.stockActual} onChange={e => setProdForm({ ...prodForm, stockActual: e.target.value })} /></FormGroup>
                <FormGroup label="Stock Mínimo"><input type="number" min="0" style={inputStyle} value={prodForm.stockMinimo} onChange={e => setProdForm({ ...prodForm, stockMinimo: e.target.value })} /></FormGroup>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button type="submit" disabled={saving} style={primaryBtnStyle}>{saving ? 'Guardando…' : '✓ Guardar'}</button></div>
            </form>
          </FormCard>
        </motion.div>
      )}

      {/* Form movimiento */}
      {showMov && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ maxWidth: 520, marginBottom: 20 }}>
          <FormCard title="Registrar Movimiento">
            <form onSubmit={handleMov} style={{ padding: '24px' }}>
              {error && <div style={errorAlertStyle}>{error}</div>}
              <FormGroup label="Producto *">
                <select style={inputStyle} value={movForm.productoId} onChange={e => setMovForm({ ...movForm, productoId: Number(e.target.value) })}>
                  <option value={0}>Seleccionar…</option>
                  {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} (stock: {p.stockActual} {p.unidadMedida})</option>)}
                </select>
              </FormGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormGroup label="Tipo">
                  <select style={inputStyle} value={movForm.tipoMovimiento} onChange={e => setMovForm({ ...movForm, tipoMovimiento: e.target.value })}>
                    <option>Entrada</option><option>Salida</option>
                  </select>
                </FormGroup>
                <FormGroup label="Cantidad *"><input type="number" min="0" step="0.01" style={inputStyle} value={movForm.cantidad} onChange={e => setMovForm({ ...movForm, cantidad: e.target.value })} /></FormGroup>
              </div>
              <FormGroup label="Notas"><input style={inputStyle} value={movForm.notas} onChange={e => setMovForm({ ...movForm, notas: e.target.value })} /></FormGroup>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button type="submit" disabled={saving} style={primaryBtnStyle}>{saving ? 'Guardando…' : '✓ Registrar'}</button></div>
            </form>
          </FormCard>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
          {[{ key: 'productos', label: 'Productos' }, { key: 'movimientos', label: 'Movimientos' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)} style={{ padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, border: tab === t.key ? 'none' : '1px solid hsl(var(--border))', background: tab === t.key ? 'hsl(var(--foreground))' : '#fff', color: tab === t.key ? '#fff' : 'hsl(var(--muted-fg))', cursor: 'pointer', transition: 'all 0.12s' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 20px' }}><div style={{ width: 28, height: 28, border: '2px solid hsl(var(--border))', borderTopColor: 'hsl(var(--accent))', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
          ) : tab === 'productos' ? (
            productos.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 20px', gap: 10, color: 'hsl(var(--muted-fg))' }}><Package size={32} strokeWidth={1} /><span style={{ fontSize: 13 }}>Sin productos</span></div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid hsl(var(--muted))' }}>
                    {['Producto', 'Categoría', 'Stock actual', 'Mínimo', 'Unidad', 'Precio', 'Estado'].map(h => (
                      <th key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.7, textTransform: 'uppercase', color: 'hsl(var(--muted-fg))', textAlign: 'left', padding: '11px 18px', opacity: 0.7 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, i) => {
                    const bajo = p.stockActual <= p.stockMinimo
                    const pct = p.stockMinimo > 0 ? Math.min((p.stockActual / p.stockMinimo) * 100, 100) : 100
                    return (
                      <tr key={p.id} style={{ borderBottom: i < productos.length - 1 ? '1px solid hsl(var(--muted))' : 'none', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'hsl(var(--secondary))')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))' }}>{p.nombre}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-fg))' }}>{p.categoria}</span>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: bajo ? '#b42a2a' : 'hsl(var(--foreground))', lineHeight: 1, marginBottom: 4 }}>{p.stockActual}</div>
                          <div style={{ height: 3, width: 64, background: 'hsl(var(--muted))', borderRadius: 2, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                              style={{ height: '100%', background: bajo ? '#e05858' : '#28825a', borderRadius: 2 }} />
                          </div>
                        </td>
                        <td style={{ padding: '14px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{p.stockMinimo}</td>
                        <td style={{ padding: '14px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{p.unidadMedida}</td>
                        <td style={{ padding: '14px 18px', fontFamily: 'var(--font-display)', fontSize: 14, color: 'hsl(var(--foreground))' }}>{'₡' + p.precioUnitario.toLocaleString('es-CR')}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: bajo ? 'rgba(180,42,42,0.08)' : 'rgba(40,130,90,0.08)', border: `1px solid ${bajo ? 'rgba(180,42,42,0.18)' : 'rgba(40,130,90,0.18)'}`, color: bajo ? '#b42a2a' : '#28825a' }}>
                            {bajo ? <><ArrowDownToLine size={10} /> Stock bajo</> : <><ArrowUpFromLine size={10} /> OK</>}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )
          ) : (
            movimientos.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 20px', gap: 10, color: 'hsl(var(--muted-fg))' }}><Package size={32} strokeWidth={1} /><span style={{ fontSize: 13 }}>Sin movimientos</span></div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid hsl(var(--muted))' }}>
                    {['Producto', 'Tipo', 'Cantidad', 'Fecha', 'Notas'].map(h => (
                      <th key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.7, textTransform: 'uppercase', color: 'hsl(var(--muted-fg))', textAlign: 'left', padding: '11px 18px', opacity: 0.7 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...movimientos].sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map((m, i) => (
                    <tr key={m.id} style={{ borderBottom: i < movimientos.length - 1 ? '1px solid hsl(var(--muted))' : 'none', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'hsl(var(--secondary))')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))' }}>{m.productoNombre}</td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: m.tipoMovimiento === 'Entrada' ? 'rgba(40,130,90,0.08)' : 'rgba(180,42,42,0.08)', color: m.tipoMovimiento === 'Entrada' ? '#28825a' : '#b42a2a' }}>
                          {m.tipoMovimiento === 'Entrada' ? <ArrowDownToLine size={10} /> : <ArrowUpFromLine size={10} />} {m.tipoMovimiento}
                        </span>
                      </td>
                      <td style={{ padding: '13px 18px', fontFamily: 'var(--font-display)', fontSize: 16, color: 'hsl(var(--foreground))' }}>{m.cantidad}</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{new Date(m.fecha).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{m.notas || <span style={{ color: 'hsl(var(--border))' }}>—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </motion.div>
    </div>
  )
}
