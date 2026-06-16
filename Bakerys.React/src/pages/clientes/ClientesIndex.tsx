import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Plus, Search } from 'lucide-react'
import { clienteService } from '../../services/clienteService'
import type { Cliente } from '../../types'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

export default function ClientesIndex() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

  const cargar = () => {
    setLoading(true)
    clienteService.getAll().then(r => { setClientes(r.data); setLoading(false) })
  }
  useEffect(() => { cargar() }, [])

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.telefono.includes(busqueda) ||
    (c.email ?? '').toLowerCase().includes(busqueda.toLowerCase())
  )

  const desactivar = async (id: number, nombre: string) => {
    if (!confirm(`¿Desactivar a ${nombre}?`)) return
    await clienteService.deactivate(id)
    cargar()
  }

  return (
    <div>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400, color: 'hsl(var(--foreground))', letterSpacing: -0.5, lineHeight: 1, marginBottom: 5 }}>
            Clientes
          </h1>
          <p style={{ fontSize: 13, color: 'hsl(var(--muted-fg))' }}>
            {clientes.length} clientes registrados en el sistema
          </p>
        </div>
        <Link to="/clientes/nuevo" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'hsl(var(--foreground))', color: '#fff', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 500, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <Plus size={14} /> Nuevo Cliente
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div {...fadeUp(0.06)} style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-fg))' }} />
          <input
            type="text" placeholder="Buscar cliente…"
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ paddingLeft: 34, paddingRight: 16, paddingTop: 9, paddingBottom: 9, border: '1px solid hsl(var(--border))', borderRadius: 100, fontSize: 13, color: 'hsl(var(--foreground))', background: '#fff', outline: 'none', width: 280 }}
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div {...fadeUp(0.12)}>
        <div style={{ background: '#fff', border: '1px solid hsl(var(--border))', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 20px', gap: 14 }}>
              <div style={{ width: 28, height: 28, border: '2px solid hsl(var(--border))', borderTopColor: 'hsl(var(--accent))', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'hsl(var(--muted-fg))' }}>Cargando clientes…</span>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : filtrados.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 20px', gap: 10, color: 'hsl(var(--muted-fg))' }}>
              <Users size={32} strokeWidth={1} />
              <span style={{ fontSize: 13 }}>No se encontraron clientes</span>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid hsl(var(--muted))' }}>
                  {['Cliente', 'Teléfono', 'Email', 'Estado', 'Acciones'].map(h => (
                    <th key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.7, textTransform: 'uppercase', color: 'hsl(var(--muted-fg))', textAlign: 'left', padding: '11px 18px', opacity: 0.7 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c, i) => (
                  <tr key={c.id}
                    style={{ borderBottom: i < filtrados.length - 1 ? '1px solid hsl(var(--muted))' : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'hsl(var(--secondary))')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '13px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'hsl(var(--foreground))', flexShrink: 0 }}>
                          {c.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'hsl(var(--foreground))' }}>{c.nombre}</div>
                          {c.notas && <div style={{ fontSize: 11, color: 'hsl(var(--muted-fg))' }}>{c.notas.slice(0, 38)}{c.notas.length > 38 ? '…' : ''}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{c.telefono}</td>
                    <td style={{ padding: '13px 18px', fontSize: 13, color: 'hsl(var(--muted-fg))' }}>{c.email || <span style={{ color: 'hsl(var(--border))' }}>—</span>}</td>
                    <td style={{ padding: '13px 18px' }}>
                      <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: c.activo ? 'rgba(40,130,90,0.08)' : 'rgba(180,42,42,0.08)', color: c.activo ? '#28825a' : '#b42a2a', border: `1px solid ${c.activo ? 'rgba(40,130,90,0.18)' : 'rgba(180,42,42,0.18)'}` }}>
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <div style={{ display: 'flex', gap: 7 }}>
                        <Link to={`/clientes/${c.id}/editar`} style={{ fontSize: 12, fontWeight: 500, padding: '4px 12px', border: '1px solid hsl(var(--border))', borderRadius: 100, color: 'hsl(var(--foreground))', textDecoration: 'none', background: '#fff' }}>
                          Editar
                        </Link>
                        {c.activo && (
                          <button onClick={() => desactivar(c.id, c.nombre)} style={{ fontSize: 12, fontWeight: 500, padding: '4px 12px', border: '1px solid rgba(180,42,42,0.25)', borderRadius: 100, color: '#b42a2a', background: 'transparent', cursor: 'pointer' }}>
                            Desactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && (
          <p style={{ marginTop: 10, fontSize: 12, color: 'hsl(var(--muted-fg))', textAlign: 'right' }}>
            {filtrados.length} de {clientes.length} cliente(s)
          </p>
        )}
      </motion.div>
    </div>
  )
}
