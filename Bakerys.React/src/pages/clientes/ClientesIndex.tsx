import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clienteService } from '../../services/clienteService'
import type { Cliente } from '../../types'

export default function ClientesIndex() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

  const cargar = () => {
    setLoading(true)
    clienteService.getAll().then(r => {
      setClientes(r.data)
      setLoading(false)
    })
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, color: 'var(--brown-800)', margin: '0 0 4px', letterSpacing: -0.5 }}>
            Clientes
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--brown-400)' }}>
            Gestión de clientes registrados
          </p>
        </div>
        <Link to="/clientes/nuevo" style={primaryBtnStyle}>
          + Nuevo Cliente
        </Link>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o email…"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Table card */}
      <div style={cardStyle}>
        {loading ? (
          <div style={loadingStyle}>Cargando clientes…</div>
        ) : filtrados.length === 0 ? (
          <div style={emptyStyle}>
            <span style={{ fontSize: 32, marginBottom: 8 }}>👥</span>
            <p>No se encontraron clientes</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--brown-100)' }}>
                {['Cliente', 'Teléfono', 'Email', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < filtrados.length - 1 ? '1px solid var(--brown-50)' : 'none' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={avatarStyle}>{c.nombre.charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--brown-800)' }}>{c.nombre}</div>
                        {c.notas && <div style={{ fontSize: 11, color: 'var(--brown-300)', marginTop: 2 }}>{c.notas.slice(0, 40)}{c.notas.length > 40 ? '…' : ''}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>{c.telefono}</td>
                  <td style={tdStyle}>{c.email || <span style={{ color: 'var(--brown-200)' }}>—</span>}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-flex', padding: '3px 10px', borderRadius: 100,
                      fontSize: 11, fontWeight: 500,
                      background: c.activo ? 'rgba(74,158,107,0.1)' : 'rgba(201,64,64,0.1)',
                      color: c.activo ? 'var(--green-600)' : 'var(--red-500)',
                    }}>
                      {c.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/clientes/${c.id}/editar`} style={editBtnStyle}>Editar</Link>
                      {c.activo && (
                        <button onClick={() => desactivar(c.id, c.nombre)} style={dangerBtnStyle}>
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
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--brown-300)', textAlign: 'right' }}>
          {filtrados.length} de {clientes.length} cliente(s)
        </div>
      )}
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(212,184,150,0.25)',
  borderRadius: 16,
  overflow: 'hidden',
}
const primaryBtnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'var(--brown-800)', color: '#fff',
  border: 'none', borderRadius: 100,
  padding: '10px 20px', fontSize: 13, fontWeight: 500,
  textDecoration: 'none', cursor: 'pointer',
}
const inputStyle: React.CSSProperties = {
  width: '100%', maxWidth: 400,
  padding: '10px 16px',
  border: '1px solid var(--brown-200)',
  borderRadius: 100,
  fontSize: 13, color: 'var(--brown-800)',
  background: '#fff',
  outline: 'none',
}
const thStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5,
  color: 'var(--brown-300)', textAlign: 'left', padding: '12px 16px',
}
const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: 13, color: 'var(--brown-600)' }
const avatarStyle: React.CSSProperties = {
  width: 34, height: 34, borderRadius: '50%',
  background: 'var(--brown-100)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 14, fontWeight: 600, color: 'var(--brown-600)', flexShrink: 0,
}
const editBtnStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 500, padding: '4px 12px',
  border: '1px solid var(--brown-200)', borderRadius: 100,
  color: 'var(--brown-600)', textDecoration: 'none',
}
const dangerBtnStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 500, padding: '4px 12px',
  border: '1px solid rgba(201,64,64,0.3)', borderRadius: 100,
  color: 'var(--red-500)', background: 'transparent', cursor: 'pointer',
}
const loadingStyle: React.CSSProperties = {
  padding: '60px 20px', textAlign: 'center',
  fontFamily: 'var(--font-display)', fontStyle: 'italic',
  fontSize: 16, color: 'var(--brown-300)',
}
const emptyStyle: React.CSSProperties = {
  padding: '60px 20px', textAlign: 'center',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  color: 'var(--brown-300)', fontSize: 13,
}
