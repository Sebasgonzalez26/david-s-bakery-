import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, ShoppingBag, Printer } from 'lucide-react'
import { pedidoService } from '../../services/pedidoService'
import type { Pedido } from '../../types'

const ESTADOS = ['Todos', 'Pendiente', 'En Proceso', 'Listo', 'Entregado', 'Cancelado']

const estadoColor: Record<string, { bg: string; color: string }> = {
  'Pendiente':  { bg: 'rgba(212,132,42,0.10)',  color: '#b86e10' },
  'En Proceso': { bg: 'rgba(66,110,190,0.10)',  color: '#3a6ac4' },
  'Listo':      { bg: 'rgba(160,100,20,0.10)',  color: '#8f621a' },
  'Entregado':  { bg: 'rgba(40,140,90,0.10)',   color: '#28825a' },
  'Cancelado':  { bg: 'rgba(180,40,40,0.10)',   color: '#b42a2a' },
}

const fmt = (n: number) => '₡' + n.toLocaleString('es-CR')
const fmtDate = (s: string) => new Date(s).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })

export default function PedidosIndex() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pedidoService.getAll().then(r => { setPedidos(r.data); setLoading(false) })
  }, [])

  const filtrados = pedidos
    .filter(p =>
      (filtroEstado === 'Todos' || p.estado === filtroEstado) &&
      (p.cliente.toLowerCase().includes(busqueda.toLowerCase()) || p.telefono.includes(busqueda)) &&
      (!filtroFecha || p.fechaEntrega.startsWith(filtroFecha))
    )
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400, color: 'hsl(var(--foreground))', letterSpacing: -0.5, lineHeight: 1, marginBottom: 5 }}>
            Pedidos
          </h1>
          <p style={{ fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{pedidos.length} pedidos registrados</p>
        </div>
        <Link to="/pedidos/nuevo" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'hsl(var(--foreground))', color: '#fff', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 500, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <Plus size={14} /> Nuevo Pedido
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06 }}
        style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-fg))' }} />
          <input type="text" placeholder="Buscar cliente…" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ paddingLeft: 34, paddingRight: 16, paddingTop: 8, paddingBottom: 8, border: '1px solid hsl(var(--border))', borderRadius: 100, fontSize: 13, color: 'hsl(var(--foreground))', background: '#fff', outline: 'none', width: 240 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="date"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
            style={{ padding: '7px 14px', border: '1px solid hsl(var(--border))', borderRadius: 100, fontSize: 13, color: filtroFecha ? 'hsl(var(--foreground))' : 'hsl(var(--muted-fg))', background: '#fff', outline: 'none', cursor: 'pointer' }}
          />
          {filtroFecha && (
            <button onClick={() => setFiltroFecha('')} style={{ padding: '6px 12px', borderRadius: 100, fontSize: 12, border: '1px solid hsl(var(--border))', background: '#fff', color: 'hsl(var(--muted-fg))', cursor: 'pointer' }}>
              ✕ Limpiar
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {ESTADOS.map(e => (
            <button key={e} onClick={() => setFiltroEstado(e)} style={{
              padding: '6px 13px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              border: filtroEstado === e ? '1px solid hsl(var(--foreground))' : '1px solid hsl(var(--border))',
              background: filtroEstado === e ? 'hsl(var(--foreground))' : '#fff',
              color: filtroEstado === e ? '#fff' : 'hsl(var(--muted-fg))',
              transition: 'all 0.12s',
            }}>{e}</button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.12 }}>
        <div style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 20px', gap: 14 }}>
              <div style={{ width: 28, height: 28, border: '2px solid hsl(var(--border))', borderTopColor: 'hsl(var(--accent))', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : filtrados.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 20px', gap: 10, color: 'hsl(var(--muted-fg))' }}>
              <ShoppingBag size={32} strokeWidth={1} />
              <span style={{ fontSize: 13 }}>No hay pedidos</span>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid hsl(var(--muted))' }}>
                  {['Cliente', 'Descripción', 'Entrega', 'Estado', 'Saldo', 'Total', ''].map(h => (
                    <th key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.7, textTransform: 'uppercase', color: 'hsl(var(--muted-fg))', textAlign: 'left', padding: '11px 18px', opacity: 0.7 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p, i) => {
                  const st = estadoColor[p.estado] ?? { bg: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))' }
                  return (
                    <tr key={p.id}
                      style={{ borderBottom: i < filtrados.length - 1 ? '1px solid hsl(var(--muted))' : 'none', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'hsl(var(--secondary))')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'hsl(var(--foreground))', flexShrink: 0 }}>
                            {p.cliente.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))' }}>{p.cliente}</div>
                            <div style={{ fontSize: 11, color: 'hsl(var(--muted-fg))' }}>{p.telefono}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))', maxWidth: 160 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{p.notas || '—'}</div>
                      </td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{fmtDate(p.fechaEntrega)}</td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ ...st, display: 'inline-flex', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500 }}>{p.estado}</span>
                      </td>
                      <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 500, color: p.saldoPendiente > 0 ? '#b42a2a' : '#28825a' }}>
                        {fmt(p.saldoPendiente)}
                      </td>
                      <td style={{ padding: '13px 18px', fontFamily: 'var(--font-display)', fontSize: 15, color: 'hsl(var(--foreground))' }}>
                        {fmt(p.montoTotal)}
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <Link to={`/pedidos/${p.id}/editar`} style={{ fontSize: 12, fontWeight: 500, padding: '4px 12px', border: '1px solid hsl(var(--border))', borderRadius: 100, color: 'hsl(var(--foreground))', textDecoration: 'none', background: '#fff', whiteSpace: 'nowrap' }}>
                            Editar
                          </Link>
                          <a href={`/pedidos/${p.id}/comanda`} target="_blank" rel="noopener noreferrer"
                            title="Imprimir comanda"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: '1px solid hsl(var(--border))', borderRadius: '50%', color: 'hsl(var(--muted-fg))', background: '#fff', textDecoration: 'none', transition: 'all 0.12s', flexShrink: 0 }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'hsl(var(--secondary))'; (e.currentTarget as HTMLElement).style.color = 'hsl(var(--foreground))' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = 'hsl(var(--muted-fg))' }}
                          >
                            <Printer size={13} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        {!loading && <p style={{ marginTop: 10, fontSize: 12, color: 'hsl(var(--muted-fg))', textAlign: 'right' }}>{filtrados.length} de {pedidos.length} pedido(s)</p>}
      </motion.div>
    </div>
  )
}
