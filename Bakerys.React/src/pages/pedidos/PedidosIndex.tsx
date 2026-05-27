import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pedidoService } from '../../services/pedidoService'
import type { Pedido } from '../../types'

const ESTADOS = ['Todos', 'Pendiente', 'En Proceso', 'Listo', 'Entregado', 'Cancelado']

const fmtMoney = (n: number) => '₡' + n.toLocaleString('es-CR')
const fmtDate  = (s: string) => new Date(s).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })

const badgeStyle = (estado: string): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string }> = {
    'Pendiente':  { bg: 'rgba(212,132,42,0.12)',  color: '#d4842a' },
    'En Proceso': { bg: 'rgba(74,122,181,0.12)',  color: '#4a7ab5' },
    'Listo':      { bg: 'rgba(212,168,67,0.12)',  color: '#b8892a' },
    'Entregado':  { bg: 'rgba(74,158,107,0.12)',  color: '#3a8558' },
    'Cancelado':  { bg: 'rgba(201,64,64,0.12)',   color: '#c94040' },
  }
  const s = map[estado] ?? { bg: 'rgba(74,49,33,0.08)', color: '#6f4e32' }
  return { display: 'inline-flex', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: s.bg, color: s.color }
}

export default function PedidosIndex() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pedidoService.getAll().then(r => { setPedidos(r.data); setLoading(false) })
  }, [])

  const filtrados = pedidos.filter(p => {
    const matchEstado = filtroEstado === 'Todos' || p.estado === filtroEstado
    const matchBusq = p.cliente.toLowerCase().includes(busqueda.toLowerCase()) || p.telefono.includes(busqueda)
    return matchEstado && matchBusq
  }).sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={pageTitle}>Pedidos</h1>
          <p style={pageSub}>Gestión de pedidos y entregas</p>
        </div>
        <Link to="/pedidos/nuevo" style={primaryBtnStyle}>+ Nuevo Pedido</Link>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text" placeholder="Buscar cliente…"
          value={busqueda} onChange={e => setBusqueda(e.target.value)}
          style={{ ...inputStyle, maxWidth: 260 }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ESTADOS.map(e => (
            <button key={e} onClick={() => setFiltroEstado(e)} style={{
              padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500,
              border: filtroEstado === e ? '1px solid var(--brown-400)' : '1px solid var(--brown-200)',
              background: filtroEstado === e ? 'var(--brown-800)' : '#fff',
              color: filtroEstado === e ? '#fff' : 'var(--brown-500)',
              cursor: 'pointer',
            }}>{e}</button>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        {loading ? (
          <div style={loadingStyle}>Cargando pedidos…</div>
        ) : filtrados.length === 0 ? (
          <div style={emptyStyle}><span style={{ fontSize: 32, marginBottom: 8 }}>📦</span><p>No hay pedidos</p></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--brown-100)' }}>
                {['Cliente', 'Descripción', 'Entrega', 'Estado', 'Saldo', 'Total', 'Acciones'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < filtrados.length - 1 ? '1px solid var(--brown-50)' : 'none' }}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={avatarStyle}>{p.cliente.charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--brown-800)' }}>{p.cliente}</div>
                        <div style={{ fontSize: 11, color: 'var(--brown-300)' }}>{p.telefono}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, maxWidth: 160 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                      {p.descripcion}
                    </div>
                  </td>
                  <td style={tdStyle}>{fmtDate(p.fechaEntrega)}</td>
                  <td style={{ padding: '13px 16px' }}><span style={badgeStyle(p.estado)}>{p.estado}</span></td>
                  <td style={{ ...tdStyle, fontWeight: 500, color: p.saldoPendiente > 0 ? 'var(--red-500)' : 'var(--green-600)' }}>
                    {fmtMoney(p.saldoPendiente)}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: 14 }}>
                    {fmtMoney(p.montoTotal)}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <Link to={`/pedidos/${p.id}/editar`} style={editBtnStyle}>Editar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && (
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--brown-300)', textAlign: 'right' }}>
          {filtrados.length} de {pedidos.length} pedido(s)
        </div>
      )}
    </div>
  )
}

const pageTitle: React.CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, color: 'var(--brown-800)', margin: '0 0 4px', letterSpacing: -0.5 }
const pageSub: React.CSSProperties = { margin: 0, fontSize: 13, color: 'var(--brown-400)' }
const cardStyle: React.CSSProperties = { background: '#fff', border: '1px solid rgba(212,184,150,0.25)', borderRadius: 16, overflow: 'hidden' }
const primaryBtnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--brown-800)', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 500, textDecoration: 'none' }
const inputStyle: React.CSSProperties = { padding: '9px 16px', border: '1px solid var(--brown-200)', borderRadius: 100, fontSize: 13, color: 'var(--brown-800)', background: '#fff', outline: 'none' }
const thStyle: React.CSSProperties = { fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--brown-300)', textAlign: 'left', padding: '12px 16px' }
const tdStyle: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: 'var(--brown-600)' }
const avatarStyle: React.CSSProperties = { width: 32, height: 32, borderRadius: '50%', background: 'var(--brown-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'var(--brown-600)', flexShrink: 0 }
const editBtnStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, padding: '4px 12px', border: '1px solid var(--brown-200)', borderRadius: 100, color: 'var(--brown-600)', textDecoration: 'none' }
const loadingStyle: React.CSSProperties = { padding: '60px 20px', textAlign: 'center', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--brown-300)' }
const emptyStyle: React.CSSProperties = { padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--brown-300)', fontSize: 13 }
