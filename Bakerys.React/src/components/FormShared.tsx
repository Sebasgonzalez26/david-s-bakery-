import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function PageHeader({ title, sub, backTo }: { title: string; sub: string; backTo: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}
    >
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400, color: 'hsl(var(--foreground))', letterSpacing: -0.5, lineHeight: 1, marginBottom: 5 }}>
          {title}
        </h1>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{sub}</p>
      </div>
      <Link to={backTo} style={{ border: '1px solid hsl(var(--border))', borderRadius: 100, padding: '9px 18px', fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))', textDecoration: 'none', background: '#fff' }}>
        ← Volver
      </Link>
    </motion.div>
  )
}

export function FormCard({ title, children, idLabel }: { title: string; children: React.ReactNode; idLabel?: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid hsl(var(--muted))' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, color: 'hsl(var(--foreground))' }}>{title}</span>
        {idLabel && <span style={{ fontSize: 12, color: 'hsl(var(--muted-fg))' }}>{idLabel}</span>}
      </div>
      {children}
    </div>
  )
}

export function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'hsl(var(--muted-fg))', marginBottom: 6, letterSpacing: 0.1 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 13px',
  border: '1px solid hsl(var(--border))', borderRadius: 8,
  fontSize: 13, fontFamily: 'var(--font-body)',
  color: 'hsl(var(--foreground))', background: '#fff',
  outline: 'none', boxSizing: 'border-box',
}

export const primaryBtnStyle: React.CSSProperties = {
  background: 'hsl(var(--foreground))', color: '#fff',
  border: 'none', borderRadius: 100, padding: '10px 22px',
  fontSize: 13, fontWeight: 500, cursor: 'pointer',
}

export const outlineBtnStyle: React.CSSProperties = {
  border: '1px solid hsl(var(--border))', borderRadius: 100,
  padding: '9px 18px', fontSize: 13, fontWeight: 500,
  color: 'hsl(var(--foreground))', textDecoration: 'none',
  display: 'inline-flex', alignItems: 'center', background: '#fff',
}

export const errorAlertStyle: React.CSSProperties = {
  background: 'rgba(180,42,42,0.06)', border: '1px solid rgba(180,42,42,0.18)',
  borderRadius: 8, padding: '10px 13px', fontSize: 13, color: '#b42a2a', marginBottom: 18,
}
