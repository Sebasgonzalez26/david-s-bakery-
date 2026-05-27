import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Package, Users, ShoppingBag, TriangleAlert, Plus, ChevronRight, TrendingUp } from 'lucide-react'
import { clienteService } from '../services/clienteService'
import { pedidoService } from '../services/pedidoService'
import { inventarioService } from '../services/inventarioService'
import { finanzasService } from '../services/finanzasService'
import type { Cliente, Pedido, Producto, ResumenFinanciero } from '../types'

// ── helpers ───────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString('es-CR', { minimumFractionDigits: 0 })
const hora = new Date().getHours()
const greeting = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'
const mesLabel = new Date().toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })

// Badge colors
const estadoColor: Record<string, { bg: string; color: string }> = {
  'Pendiente':  { bg: 'rgba(212,132,42,0.10)',  color: '#b86e10' },
  'En Proceso': { bg: 'rgba(66,110,190,0.10)',  color: '#3a6ac4' },
  'Listo':      { bg: 'rgba(160,100,20,0.10)',  color: '#8f621a' },
  'Entregado':  { bg: 'rgba(40,140,90,0.10)',   color: '#28825a' },
  'Cancelado':  { bg: 'rgba(180,40,40,0.10)',   color: '#b42a2a' },
}

// SVG sparkline — generates a smooth path from data array (0-1 normalized)
function Sparkline({ data, color = '#c9913d' }: { data: number[]; color?: string }) {
  const w = 200, h = 56
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 8) - 4,
  ])
  const path = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x},${y}`
    const [px, py] = pts[i - 1]
    const cx = (px + x) / 2
    return `${acc} C${cx},${py} ${cx},${y} ${x},${y}`
  }, '')
  const area = `${path} L${w},${h} L0,${h} Z`

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#','')})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Mini bar chart
function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data) || 1
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 36 }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.6 + i * 0.04, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            flex: 1, borderRadius: '3px 3px 0 0',
            background: i === data.length - 1 ? 'hsl(var(--accent))' : 'hsl(var(--border))',
            height: `${(v / max) * 100}%`,
            transformOrigin: 'bottom',
            minHeight: 4,
          }}
        />
      ))}
    </div>
  )
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

// ── Component ─────────────────────────────────────────────────
export default function Dashboard() {
  const [clientes, setClientes]   = useState<Cliente[]>([])
  const [pedidos,  setPedidos]    = useState<Pedido[]>([])
  const [stock,    setStock]      = useState<Producto[]>([])
  const [resumen,  setResumen]    = useState<ResumenFinanciero | null>(null)
  const [loading,  setLoading]    = useState(true)

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
      if (s.status === 'fulfilled') setStock(s.value.data)
      if (r.status === 'fulfilled') setResumen(r.value.data)
      setLoading(false)
    })
  }, [])

  const activos    = pedidos.filter(p => !['Entregado','Cancelado'].includes(p.estado)).length
  const pendientes = pedidos.filter(p => p.estado === 'Pendiente').length
  const recientes  = [...pedidos].sort((a,b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()).slice(0, 6)

  // Fake weekly bar data shaped from real activos count
  const barData = [4, 7, 5, 9, 6, activos || 8, activos ? activos + 2 : 11]
  const sparkData = resumen
    ? [resumen.totalGastos * 0.6, resumen.totalGastos * 0.8, resumen.totalIngresos * 0.5,
       resumen.totalIngresos * 0.7, resumen.totalIngresos * 0.9, resumen.totalIngresos]
    : [30, 55, 40, 70, 60, 85, 95]

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', gap: 14 }}>
      <div style={{ width: 32, height: 32, border: '2px solid hsl(var(--border))', borderTopColor: 'hsl(var(--accent))', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 17, color: 'hsl(var(--muted-fg))' }}>Cargando…</span>
      <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 20 }}>
        <div style={{
          position: 'relative',
          borderRadius: 24,
          overflow: 'hidden',
          background: 'hsl(var(--foreground))',
          minHeight: 240,
        }}>
          {/* Background mesh */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse at 80% 20%, rgba(201,145,61,0.28) 0%, transparent 55%),
              radial-gradient(ellipse at 10% 90%, rgba(120,70,20,0.35) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(40,20,10,0.2) 0%, transparent 70%)
            `,
            zIndex: 0,
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
            <div>
              {/* Tag */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 100, padding: '4px 14px',
                fontSize: 10, fontWeight: 600, letterSpacing: 1.4,
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
                marginBottom: 20,
              }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'hsl(var(--accent))', animation: 'spin 3s linear infinite' }} />
                Panel Administrativo
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 52, fontWeight: 400,
                lineHeight: 1.06, letterSpacing: '-0.5px',
                color: 'rgba(255,255,255,0.92)',
                marginBottom: 22,
              }}>
                {greeting},<br />
                <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.38)' }}>Davi's Bakery.</em>
              </h1>

              {/* Meta row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { icon: <ShoppingBag size={13} />, text: <><strong style={{ color: 'rgba(255,255,255,0.8)' }}>{activos}</strong> pedidos activos</> },
                  { icon: <Users size={13} />, text: <><strong style={{ color: 'rgba(255,255,255,0.8)' }}>{clientes.length}</strong> clientes</> },
                  ...(stock.length > 0 ? [{ icon: <TriangleAlert size={13} />, text: <><strong style={{ color: 'rgba(255,200,100,0.9)' }}>{stock.length}</strong> stock bajo</>, warn: true }] : []),
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: m.warn ? 'rgba(255,180,80,0.7)' : 'rgba(255,255,255,0.38)' }}>
                    {m.icon} {m.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue glass card */}
            {resumen && (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '22px 26px',
                minWidth: 200, flexShrink: 0,
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 8 }}>
                  Ingresos · {mesLabel}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, color: '#fff', letterSpacing: -1, lineHeight: 1, marginBottom: 12 }}>
                  ₡{fmt(resumen.totalIngresos)}
                </div>
                <Sparkline data={sparkData} color="#c9913d" />
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', marginTop: 8 }}>
                  Balance ₡{fmt(resumen.balanceNeto)}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── KPI CARDS ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          {
            label: 'Clientes', value: clientes.length, icon: <Users size={15} />,
            sub: 'registrados', accent: '#3a6ac4',
            trend: null,
          },
          {
            label: 'Pedidos activos', value: activos, icon: <ShoppingBag size={15} />,
            sub: pendientes > 0 ? `${pendientes} pendientes` : 'Al día',
            accent: '#c9913d',
            trend: pendientes > 0 ? 'down' : 'up',
          },
          {
            label: 'Gastos del mes', value: resumen ? `₡${fmt(resumen.totalGastos)}` : '—',
            icon: <TrendingUp size={15} />,
            sub: 'este mes', accent: '#28825a',
            trend: null, small: true,
          },
          {
            label: 'Stock bajo', value: stock.length, icon: <TriangleAlert size={15} />,
            sub: stock.length === 0 ? 'Inventario en orden' : 'requieren atención',
            accent: '#b42a2a',
            trend: stock.length > 0 ? 'down' : 'up',
          },
        ].map((k, i) => (
          <motion.div key={i} {...fadeUp(0.06 + i * 0.06)}>
            <div style={{
              background: '#fff',
              border: '1px solid hsl(var(--border))',
              borderRadius: 16,
              padding: '20px 20px 16px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              transition: 'box-shadow 0.2s, transform 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-card)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
            >
              {/* Top stripe */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: k.accent, borderRadius: '16px 16px 0 0', opacity: 0.7 }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', color: 'hsl(var(--muted-fg))' }}>{k.label}</span>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'hsl(var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.accent }}>
                  {k.icon}
                </div>
              </div>

              <div style={{
                fontFamily: k.small ? 'var(--font-body)' : 'var(--font-display)',
                fontSize: k.small ? 24 : 44,
                fontWeight: k.small ? 600 : 400,
                color: 'hsl(var(--foreground))',
                letterSpacing: k.small ? -0.5 : -2,
                lineHeight: 1, marginBottom: 12,
              }}>
                {k.value}
              </div>

              <div style={{ height: 1, background: 'hsl(var(--muted))', marginBottom: 10 }} />

              <div style={{ fontSize: 12, color: 'hsl(var(--muted-fg))', display: 'flex', alignItems: 'center', gap: 4 }}>
                {k.trend === 'up' && <ArrowUpRight size={12} color="#28825a" />}
                {k.trend === 'down' && <ArrowDownRight size={12} color="#b86e10" />}
                {k.sub}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── MAIN GRID ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 308px', gap: 16 }}>

        {/* Left — pedidos recientes */}
        <motion.div {...fadeUp(0.3)}>
          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>Pedidos recientes</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, hsl(var(--border)), transparent)' }} />
          </div>

          <div style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid hsl(var(--muted))' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, color: 'hsl(var(--foreground))' }}>
                Últimos pedidos
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'hsl(var(--muted-fg))', background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))', borderRadius: 100, padding: '2px 9px' }}>
                  {pedidos.length} total
                </span>
                <Link to="/pedidos" style={{
                  fontSize: 12, fontWeight: 500, color: 'hsl(var(--muted-fg))',
                  padding: '5px 12px', border: '1px solid hsl(var(--border))',
                  borderRadius: 100, textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 4,
                  transition: 'all 0.12s',
                }}>
                  Ver todos <ChevronRight size={11} />
                </Link>
              </div>
            </div>

            {recientes.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Cliente', 'Entrega', 'Estado', 'Saldo', 'Total'].map(h => (
                      <th key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.7, textTransform: 'uppercase', color: 'hsl(var(--muted-fg))', textAlign: 'left', padding: '10px 18px', borderBottom: '1px solid hsl(var(--muted))', opacity: 0.7 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recientes.map((p, i) => {
                    const st = estadoColor[p.estado] ?? { bg: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))' }
                    return (
                      <tr key={p.id} style={{ borderBottom: i < recientes.length - 1 ? '1px solid hsl(var(--muted))' : 'none', transition: 'background 0.1s' }}
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
                        <td style={{ padding: '13px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>
                          {new Date(p.fechaEntrega).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ ...st, display: 'inline-flex', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500 }}>
                            {p.estado}
                          </span>
                        </td>
                        <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 500, color: p.saldoPendiente > 0 ? '#b42a2a' : '#28825a' }}>
                          ₡{fmt(p.saldoPendiente)}
                        </td>
                        <td style={{ padding: '13px 18px', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 400, color: 'hsl(var(--foreground))' }}>
                          ₡{fmt(p.montoTotal)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 20px', gap: 10, color: 'hsl(var(--muted-fg))' }}>
                <Package size={28} strokeWidth={1} />
                <span style={{ fontSize: 13 }}>No hay pedidos registrados</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Pedidos por estado — bar chart */}
          <motion.div {...fadeUp(0.35)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>Esta semana</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, hsl(var(--border)), transparent)' }} />
            </div>
            <div style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 16, padding: '18px 20px', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', color: 'hsl(var(--muted-fg))', marginBottom: 4 }}>Pedidos</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, color: 'hsl(var(--foreground))', letterSpacing: -1, lineHeight: 1 }}>
                    {activos}
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#28825a', background: 'rgba(40,130,90,0.08)', border: '1px solid rgba(40,130,90,0.15)', borderRadius: 100, padding: '3px 9px', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <ArrowUpRight size={10} /> activos
                </div>
              </div>
              <BarChart data={barData} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                {['L','M','X','J','V','S','D'].map(d => (
                  <span key={d} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'hsl(var(--muted-fg))', opacity: 0.6 }}>{d}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Accesos rápidos */}
          <motion.div {...fadeUp(0.4)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>Accesos rápidos</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, hsl(var(--border)), transparent)' }} />
            </div>
            <div style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
              {[
                { to: '/clientes/nuevo', icon: <Plus size={14} />, title: 'Nuevo Cliente',  sub: 'Registrar cliente' },
                { to: '/pedidos/nuevo',  icon: <Plus size={14} />, title: 'Nuevo Pedido',   sub: 'Crear pedido' },
                { to: '/inventario',     icon: <Package size={14} />, title: 'Inventario',  sub: 'Gestionar stock' },
              ].map((item, i, arr) => (
                <Link key={item.to} to={item.to} style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '12px 16px',
                  borderBottom: i < arr.length - 1 ? '1px solid hsl(var(--muted))' : 'none',
                  textDecoration: 'none', transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'hsl(var(--secondary))')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--foreground))', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))' }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: 'hsl(var(--muted-fg))' }}>{item.sub}</div>
                  </div>
                  <ChevronRight size={13} color="hsl(var(--border))" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Stock bajo */}
          <motion.div {...fadeUp(0.46)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>Alertas de stock</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, hsl(var(--border)), transparent)' }} />
            </div>
            <div style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 16, padding: '16px 18px', boxShadow: 'var(--shadow-card)' }}>
              {stock.length > 0 ? (
                <>
                  {stock.slice(0, 4).map(p => {
                    const pct = p.stockMinimo > 0 ? Math.min((p.stockActual / p.stockMinimo) * 100, 100) : 0
                    return (
                      <div key={p.id} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: 'hsl(var(--foreground))' }}>{p.nombre}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#b42a2a' }}>{p.stockActual}/{p.stockMinimo} {p.unidadMedida}</span>
                        </div>
                        <div style={{ height: 3, background: 'hsl(var(--muted))', borderRadius: 2, overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
                            style={{ height: '100%', background: '#e05858', borderRadius: 2 }} />
                        </div>
                      </div>
                    )
                  })}
                  <Link to="/inventario" style={{ display: 'block', textAlign: 'center', fontSize: 12, fontWeight: 500, color: 'hsl(var(--muted-fg))', border: '1px solid hsl(var(--border))', borderRadius: 8, padding: '7px', textDecoration: 'none', marginTop: 4, transition: 'all 0.12s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'hsl(var(--secondary))' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
                  >
                    Ver inventario →
                  </Link>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(40,130,90,0.06)', border: '1px solid rgba(40,130,90,0.15)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#28825a', fontWeight: 500 }}>
                  ✓ Inventario en orden
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
