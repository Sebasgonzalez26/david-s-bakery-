import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/',           label: 'Dashboard'  },
  { to: '/clientes',   label: 'Clientes'   },
  { to: '/pedidos',    label: 'Pedidos'    },
  { to: '/pagos',      label: 'Pagos'      },
  { to: '/inventario', label: 'Inventario' },
  { to: '/finanzas',   label: 'Finanzas'   },
]

const now = new Date()
const dateLabel = now.toLocaleDateString('es-CR', {
  day: '2-digit', month: 'short', year: 'numeric'
})

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)', maxWidth: 1140,
        background: 'rgba(250,247,244,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(212,184,150,0.4)',
        borderRadius: 100,
        zIndex: 100,
        display: 'flex', alignItems: 'center',
        padding: '0 10px 0 20px',
        height: 56,
        boxShadow: '0 4px 24px rgba(74,49,33,0.08), 0 1px 4px rgba(74,49,33,0.04)',
      }}>
        {/* Brand */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--gold-400)',
            boxShadow: '0 0 0 3px rgba(212,168,67,0.2)',
          }} />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18, fontWeight: 500,
            color: 'var(--brown-800)',
            letterSpacing: 0.2,
            whiteSpace: 'nowrap',
          }}>
            Davi's Bakery
          </span>
        </NavLink>

        {/* Separator */}
        <div style={{ width: 1, height: 20, background: 'var(--brown-200)', margin: '0 8px' }} />

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--brown-800)' : 'var(--brown-400)',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 100,
                background: isActive ? 'rgba(74,49,33,0.07)' : 'transparent',
                transition: 'all 0.15s',
                letterSpacing: 0.1,
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Date */}
        <span style={{
          fontSize: 12, color: 'var(--brown-300)',
          fontFamily: 'var(--font-sans)',
          whiteSpace: 'nowrap',
          paddingRight: 10,
        }}>
          {dateLabel}
        </span>
      </header>

      {/* ── Main content ───────────────────────────────────── */}
      <main style={{
        paddingTop: 88,
        paddingBottom: 48,
        paddingLeft: 24,
        paddingRight: 24,
        maxWidth: 1180,
        margin: '0 auto',
      }}>
        <Outlet />
      </main>
    </div>
  )
}
