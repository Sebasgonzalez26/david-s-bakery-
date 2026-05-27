import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clienteService } from '../services/clienteService'
import { pedidoService } from '../services/pedidoService'
import { inventarioService } from '../services/inventarioService'
import { finanzasService } from '../services/finanzasService'
import type { Cliente, Pedido, Producto, ResumenFinanciero } from '../types'

// ── Helpers ──────────────────────────────────────────────────
const fmtMoney = (n: number) =>
  '₡' + n.toLocaleString('es-CR', { minimumFractionDigits: 0 })

const badgeStyle = (estado: string): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string }> = {
    'Pendiente':  { bg: 'rgba(212,132,42,0.12)',  color: 'var(--amber-500)' },
    'En Proceso': { bg: 'rgba(74,122,181,0.12)',  color: 'var(--blue-500)'  },
    'Listo':      { bg: 'rgba(212,168,67,0.12)',   color: 'var(--gold-500)'  },
    'Entregado':  { bg: 'rgba(74,158,107,0.12)',  color: 'var(--green-600)' },
    'Cancelado':  { bg: 'rgba(201,64,64,0.12)',   color: 'var(--red-500)'   },
  }
  const s = map[estado] ?? { bg: 'rgba(74,49,33,0.08)', color: 'var(--brown-600)' }
  return {
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 10px', borderRadius: 100,
    fontSize: 11, fontWeight: 500, letterSpacing: 0.3,
    background: s.bg, color: s.color,
  }
}

const hora = new Date().getHours()
const greeting = hora < 12 ? 'Buenos días,' : hora < 19 ? 'Buenas tardes,' : 'Buenas noches,'
const mesAnio = new Date().toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })
const mesLabel = mesAnio.charAt(0).toUpperCase() + mesAnio.slice(1)
const diaLabel = (() => {
  const d = new Date().toLocaleDateString('es-CR', { weekday: 'long', day: '2-digit', month: 'long' })
  return d.charAt(0).toUpperCase() + d.slice(1)
})()

// ── Component ────────────────────────────────────────────────
export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [stockBajo, setStockBajo] = useState<Producto[]>([])
  const [resumen, setResumen] = useState<ResumenFinanciero | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const now = new Date()
    Promise.allSettled([
      clienteService.getAll(),
      pedidoService.getAll(),
      inventarioService.getStockBajo(),
      finanzasService.getResumen(now.getMonth() + 1, now.getFullYear()),
    ]).then(([c, p, s, r]) => {
      if (c.status === 'fulfilled') setClientes(c.value.data)
      if (p.status === 'fulfilled') setPedidos(p.value.data)
      if (s.status === 'fulfilled') setStockBajo(s.value.data)
      if (r.status === 'fulfilled') setResumen(r.value.data)
      setLoading(false)
    })
  }, [])

  const pedidosActivos   = pedidos.filter(p => p.estado !== 'Entregado' && p.estado !== 'Cancelado').length
  const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente').length
  const recientes        = [...pedidos].sort((a, b) =>
    new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
  ).slice(0, 7)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '2px solid var(--brown-200)', borderTopColor: 'var(--brown-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--brown-400)', fontStyle: 'italic' }}>Cargando dashboard…</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brown-800) 0%, var(--brown-700) 50%, #8b5e3c 100%)',
        borderRadius: 24,
        padding: '40px 48px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Deco text */}
        <div style={{
          position: 'absolute', right: -20, top: -20,
          fontFamily: 'var(--font-display)',
          fontSize: 180, fontWeight: 600, fontStyle: 'italic',
          color: 'rgba(255,255,255,0.04)',
          lineHeight: 1, pointerEvents: 'none',
          userSelect: 'none',
        }}>DB</div>

        {/* Gold accent line */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderRadius: '24px 0 0 24px', background: 'linear-gradient(to bottom, var(--gold-400), var(--gold-300))' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 100, padding: '4px 14px',
              fontSize: 11, fontWeight: 500, letterSpacing: 1.2,
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold-400)' }} />
              Panel Administrativo
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 48, fontWeight: 400,
              color: '#fff',
              margin: '0 0 4px',
              lineHeight: 1.1,
              letterSpacing: '-0.5px',
            }}>
              {greeting}<br />
              <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>Davi's Bakery.</em>
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                <span>📅</span> {diaLabel}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                <span>📦</span>
                <strong style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{pedidosActivos}</strong> pedido(s) activo(s)
              </div>
              {stockBajo.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,180,120,0.8)' }}>
                  <span>⚠️</span>
                  <strong style={{ color: 'rgba(255,200,140,0.9)' }}>{stockBajo.length}</strong> alerta(s) de stock
                </div>
              )}
            </div>
          </div>

          {/* Revenue block */}
          {resumen && (
            <div style={{
              textAlign: 'right',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              padding: '20px 28px',
              minWidth: 200,
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                Ingresos {new Date().toLocaleDateString('es-CR', { month: 'short' })}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 36, fontWeight: 500,
                color: '#fff', lineHeight: 1, letterSpacing: '-1px',
              }}>
                {fmtMoney(resumen.totalIngresos)}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
                Balance {fmtMoney(resumen.balanceNeto)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── KPIs ──────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 28,
      }}>
        {[
          { label: 'Clientes', value: clientes.length, sub: 'registrados en el sistema', color: 'var(--brown-800)', icon: '👥' },
          { label: 'Pedidos activos', value: pedidosActivos, sub: pedidosPendientes > 0 ? `${pedidosPendientes} pendiente(s)` : 'al día', color: 'var(--gold-500)', icon: '📦' },
          { label: 'Gastos del mes', value: resumen ? fmtMoney(resumen.totalGastos) : '—', sub: 'registrados este mes', color: 'var(--green-600)', icon: '🧾' },
          { label: 'Stock bajo', value: stockBajo.length, sub: stockBajo.length === 0 ? 'inventario en orden' : 'requieren atención', color: 'var(--red-500)', icon: '⚠️' },
        ].map((kpi, i) => (
          <div key={i} style={{
            background: '#fff',
            border: '1px solid rgba(212,184,150,0.25)',
            borderRadius: 16,
            padding: '22px 24px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Top line accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: kpi.color, opacity: 0.6, borderRadius: '16px 16px 0 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--brown-400)', fontWeight: 500, letterSpacing: 0.2 }}>{kpi.label}</span>
              <span style={{ fontSize: 20 }}>{kpi.icon}</span>
            </div>
            <div style={{
              fontFamily: typeof kpi.value === 'number' ? 'var(--font-display)' : 'var(--font-sans)',
              fontSize: typeof kpi.value === 'number' ? 44 : 28,
              fontWeight: 500,
              color: 'var(--brown-800)',
              lineHeight: 1,
              letterSpacing: -1,
              marginBottom: 10,
            }}>
              {kpi.value}
            </div>
            <div style={{ height: 1, background: 'var(--brown-100)', marginBottom: 10 }} />
            <div style={{ fontSize: 12, color: 'var(--brown-300)' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Main grid ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* Pedidos recientes */}
        <div>
          <SectionLabel>Pedidos recientes</SectionLabel>
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <span style={cardTitleStyle}>⏱ Últimos pedidos</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={chipStyle}>{pedidos.length} total</span>
                <Link to="/pedidos" style={ghostBtnStyle}>Ver todos →</Link>
              </div>
            </div>

            {recientes.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Cliente', 'Entrega', 'Estado', 'Saldo', 'Total'].map(h => (
                      <th key={h} style={{ fontSize: 11, fontWeight: 500, color: 'var(--brown-300)', textAlign: 'left', padding: '0 12px 12px', letterSpacing: 0.5, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recientes.map((p, idx) => (
                    <tr key={p.id} style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--brown-50)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'var(--brown-100)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 600, color: 'var(--brown-600)',
                            flexShrink: 0,
                          }}>
                            {p.cliente.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--brown-800)' }}>{p.cliente}</div>
                            <div style={{ fontSize: 11, color: 'var(--brown-300)' }}>{p.telefono}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, color: 'var(--brown-600)' }}>
                        {new Date(p.fechaEntrega).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={badgeStyle(p.estado)}>{p.estado}</span>
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, fontWeight: 500, color: p.saldoPendiente > 0 ? 'var(--red-500)' : 'var(--green-600)' }}>
                        {fmtMoney(p.saldoPendiente)}
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: -0.3 }}>
                        {fmtMoney(p.montoTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState icon="📦" message="No hay pedidos registrados aún" />
            )}
          </div>
        </div>

        {/* Panel lateral */}
        <div>
          <SectionLabel>Accesos rápidos</SectionLabel>
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            {[
              { to: '/clientes/nuevo', icon: '👤', title: 'Nuevo Cliente', sub: 'Registrar cliente nuevo' },
              { to: '/pedidos/nuevo',  icon: '📋', title: 'Nuevo Pedido',  sub: 'Crear pedido para un cliente' },
              { to: '/inventario',     icon: '📦', title: 'Inventario',    sub: 'Gestionar productos y stock' },
              { to: '/finanzas',       icon: '📊', title: 'Finanzas',      sub: 'Ingresos, gastos y balance' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 20px',
                borderBottom: '1px solid var(--brown-50)',
                textDecoration: 'none',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--brown-50)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--brown-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--brown-800)' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--brown-300)' }}>{item.sub}</div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--brown-200)' }}>›</span>
              </Link>
            ))}
          </div>

          <SectionLabel>Alertas de stock</SectionLabel>
          <div style={cardStyle}>
            {stockBajo.length > 0 ? (
              <div style={{ padding: '16px 20px' }}>
                {stockBajo.slice(0, 4).map(prod => {
                  const pct = prod.stockMinimo > 0
                    ? Math.min((prod.stockActual / prod.stockMinimo) * 100, 100) : 0
                  return (
                    <div key={prod.id} style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--brown-800)' }}>{prod.nombre}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--red-500)' }}>
                          {prod.stockActual}/{prod.stockMinimo} {prod.unidadMedida}
                        </span>
                      </div>
                      <div style={{ height: 4, background: 'var(--brown-100)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--red-400)', borderRadius: 2, transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  )
                })}
                <Link to="/inventario" style={{
                  display: 'block', textAlign: 'center', padding: '8px 0',
                  fontSize: 12, fontWeight: 500, color: 'var(--brown-500)',
                  border: '1px solid var(--brown-200)', borderRadius: 8,
                  textDecoration: 'none', marginTop: 4,
                  transition: 'all 0.12s',
                }}>
                  Ver inventario completo
                </Link>
              </div>
            ) : (
              <div style={{ padding: '16px 20px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(74,158,107,0.08)',
                  border: '1px solid rgba(74,158,107,0.2)',
                  borderRadius: 10, padding: '12px 16px',
                  fontSize: 13, color: 'var(--green-600)',
                }}>
                  ✅ Inventario en orden
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Shared sub-components ─────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 13, fontStyle: 'italic',
        color: 'var(--brown-400)',
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, var(--brown-200), transparent)' }} />
    </div>
  )
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', color: 'var(--brown-300)' }}>
      <span style={{ fontSize: 32, marginBottom: 10 }}>{icon}</span>
      <p style={{ margin: 0, fontSize: 13 }}>{message}</p>
    </div>
  )
}

// ── Inline style constants ────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(212,184,150,0.25)',
  borderRadius: 16,
  overflow: 'hidden',
}

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '18px 20px',
  borderBottom: '1px solid var(--brown-50)',
}

const cardTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 16, fontWeight: 500,
  color: 'var(--brown-800)',
}

const chipStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 500,
  color: 'var(--brown-400)',
  background: 'var(--brown-50)',
  border: '1px solid var(--brown-200)',
  borderRadius: 100,
  padding: '3px 10px',
}

const ghostBtnStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 500,
  color: 'var(--brown-500)',
  textDecoration: 'none',
  padding: '4px 12px',
  border: '1px solid var(--brown-200)',
  borderRadius: 100,
  transition: 'all 0.12s',
}
