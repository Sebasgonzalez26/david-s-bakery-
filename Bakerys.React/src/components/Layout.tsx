import { NavLink, Outlet } from 'react-router-dom'

const navLinks = [
  { to: '/',           label: 'Dashboard',  end: true },
  { to: '/clientes',   label: 'Clientes'   },
  { to: '/pedidos',    label: 'Pedidos'    },
  { to: '/pagos',      label: 'Pagos'      },
  { to: '/inventario', label: 'Inventario' },
  { to: '/finanzas',   label: 'Finanzas'   },
]

export default function Layout() {
  const dateStr = new Date().toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: 'hsl(var(--background))' }}>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <header style={{
        position: 'fixed',
        top: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: 1160,
        height: 52,
        background: 'rgba(252,250,248,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: 100,
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px 0 20px',
        zIndex: 200,
        boxShadow: '0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
      }}>

        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0, marginRight: 6 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: 'hsl(var(--foreground))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff', fontWeight: 400 }}>D</span>
          </div>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
            color: 'hsl(var(--foreground))', letterSpacing: '-0.2px',
            whiteSpace: 'nowrap',
          }}>
            Davi's Bakery
          </span>
        </NavLink>

        {/* Divider */}
        <div style={{ width: 1, height: 16, background: 'hsl(var(--border))', margin: '0 10px', flexShrink: 0 }} />

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-fg))',
                textDecoration: 'none',
                padding: '5px 12px',
                borderRadius: 100,
                background: isActive ? 'rgba(0,0,0,0.06)' : 'transparent',
                transition: 'all 0.15s',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Date chip */}
        <span style={{
          fontSize: 12, color: 'hsl(var(--muted-fg))',
          fontFamily: 'var(--font-body)',
          paddingRight: 10, whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {dateStr}
        </span>
      </header>

      {/* ── Page content ───────────────────────────────────── */}
      <main style={{
        paddingTop: 80,
        paddingBottom: 56,
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
