import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { pedidoService } from '../../services/pedidoService'
import { pagoService } from '../../services/pagoService'
import type { Pedido, Pago } from '../../types'

const fmt = (n: number) => '₡' + n.toLocaleString('es-CR', { minimumFractionDigits: 0 })
const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' })
const fmtDateTime = (s: string) =>
  new Date(s).toLocaleString('es-CR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function Comanda() {
  const { id } = useParams<{ id: string }>()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    pedidoService.getById(Number(id))
      .then(pRes => {
        setPedido(pRes.data)
        return pagoService.getByPedido(Number(id)).catch(() => ({ data: [] as Pago[] }))
      })
      .then(pgRes => {
        setPagos(pgRes.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error cargando comanda:', err)
        setError('No se pudo cargar el pedido. Verificá que el API esté corriendo.')
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: 28, height: 28, border: '2px solid #e5d5c0', borderTopColor: '#8f621a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (error) return <div style={{ textAlign: 'center', padding: 40, color: '#b42a2a', fontFamily: 'sans-serif' }}>{error}</div>
  if (!pedido) return <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>Pedido no encontrado</div>

  const totalPagado = pedido.montoTotal - pedido.saldoPendiente
  const tieneEnvio = pedido.notas?.toLowerCase().includes('envío') || pedido.notas?.toLowerCase().includes('envio')
  const notasLimpias = pedido.notas?.trim() || '—'

  const estadoColor: Record<string, string> = {
    'Pendiente':  '#b86e10',
    'En Proceso': '#3a6ac4',
    'Listo':      '#8f621a',
    'Entregado':  '#28825a',
    'Cancelado':  '#b42a2a',
  }
  const colorEstado = estadoColor[pedido.estado] ?? '#666'

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f0ea; font-family: 'Georgia', serif; }

        .comanda-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 20px 48px;
          gap: 20px;
        }

        .btn-print {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #3d2b1a;
          color: #fff;
          border: none;
          border-radius: 100px;
          padding: 10px 24px;
          font-size: 14px;
          font-family: sans-serif;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          transition: background 0.15s;
        }
        .btn-print:hover { background: #5a3d28; }

        .comanda {
          background: #fff;
          width: 100%;
          max-width: 480px;
          border-radius: 12px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.10);
          overflow: hidden;
        }

        .comanda-header {
          background: #3d2b1a;
          padding: 28px 28px 22px;
          text-align: center;
          color: #fff;
        }
        .comanda-header .bakery-name {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 2px;
        }
        .comanda-header .bakery-sub {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          opacity: 0.65;
          font-family: sans-serif;
        }

        .comanda-meta {
          background: #f5f0ea;
          padding: 12px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: sans-serif;
          font-size: 12px;
          color: #6b5240;
          border-bottom: 1px dashed #d4bfa5;
        }
        .comanda-meta .pedido-id {
          font-size: 16px;
          font-weight: 700;
          color: #3d2b1a;
        }
        .comanda-meta .estado-badge {
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          font-family: sans-serif;
          border: 1.5px solid currentColor;
        }

        .comanda-body { padding: 24px 28px; }

        .section-title {
          font-family: sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #a07850;
          margin-bottom: 8px;
        }

        .info-block { margin-bottom: 22px; }

        .client-name {
          font-size: 22px;
          font-weight: 700;
          color: #1a0f08;
          margin-bottom: 2px;
        }
        .client-phone {
          font-family: sans-serif;
          font-size: 14px;
          color: #6b5240;
        }

        .divider {
          border: none;
          border-top: 1px dashed #d4bfa5;
          margin: 18px 0;
        }

        .descripcion-box {
          background: #faf7f3;
          border: 1px solid #e8ddd0;
          border-radius: 8px;
          padding: 14px 16px;
          font-size: 14px;
          color: #2a1a0e;
          line-height: 1.6;
          white-space: pre-wrap;
          min-height: 60px;
        }

        .entrega-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          font-family: sans-serif;
        }
        .entrega-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #a07850;
        }
        .entrega-value {
          font-size: 14px;
          font-weight: 700;
          color: #1a0f08;
        }

        .envio-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 100px;
          font-family: sans-serif;
          font-size: 12px;
          font-weight: 600;
          margin-top: 12px;
        }
        .envio-si {
          background: rgba(40,130,90,0.10);
          color: #28825a;
          border: 1px solid rgba(40,130,90,0.25);
        }
        .envio-no {
          background: rgba(90,60,20,0.08);
          color: #6b4020;
          border: 1px solid rgba(90,60,20,0.18);
        }

        .pagos-table { width: 100%; border-collapse: collapse; font-family: sans-serif; }
        .pagos-table th {
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #a07850;
          text-align: left;
          padding-bottom: 6px;
          border-bottom: 1px solid #e8ddd0;
        }
        .pagos-table td {
          font-size: 13px;
          color: #2a1a0e;
          padding: 7px 0;
          border-bottom: 1px solid #f0e8de;
        }
        .pagos-table td:last-child { text-align: right; font-weight: 600; }
        .pagos-empty {
          font-family: sans-serif;
          font-size: 13px;
          color: #a07850;
          font-style: italic;
          padding: 8px 0;
        }

        .totales { font-family: sans-serif; }
        .totales-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          font-size: 13px;
          color: #4a3020;
        }
        .totales-row.total-final {
          border-top: 2px solid #3d2b1a;
          margin-top: 6px;
          padding-top: 10px;
          font-size: 18px;
          font-weight: 700;
          color: #1a0f08;
          font-family: 'Georgia', serif;
        }
        .totales-row.saldo-row {
          font-size: 14px;
          font-weight: 700;
          color: #b42a2a;
        }
        .totales-row.saldo-ok { color: #28825a; }

        .comanda-footer {
          background: #3d2b1a;
          padding: 16px 28px;
          text-align: center;
          color: rgba(255,255,255,0.55);
          font-family: sans-serif;
          font-size: 11px;
          letter-spacing: 0.5px;
        }

        @page {
          size: A4 portrait;
          margin: 12mm;
        }

        @media print {
          body { background: #fff; }
          .btn-print { display: none !important; }
          .comanda-wrapper {
            padding: 0;
            background: #fff;
            min-height: unset;
            display: block;
          }
          .comanda {
            box-shadow: none;
            border-radius: 0;
            max-width: 100%;
            width: 100%;
          }
        }
      `}</style>

      <div className="comanda-wrapper">
        <button className="btn-print" onClick={() => window.print()}>
          🖨️ Imprimir Comanda
        </button>

        <div className="comanda">
          {/* Header */}
          <div className="comanda-header">
            <div className="bakery-name">David's Bakery</div>
            <div className="bakery-sub">Repostería & Pastelería Artesanal</div>
          </div>

          {/* Meta row */}
          <div className="comanda-meta">
            <div>
              <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>COMANDA</div>
              <div className="pedido-id">#{String(pedido.id).padStart(4, '0')}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: 4 }}>
                <span className="estado-badge" style={{ color: colorEstado }}>
                  {pedido.estado}
                </span>
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                {fmtDate(pedido.fechaCreacion)}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="comanda-body">

            {/* Cliente */}
            <div className="info-block">
              <div className="section-title">Cliente</div>
              <div className="client-name">{pedido.cliente}</div>
              <div className="client-phone">📞 {pedido.telefono}</div>
            </div>

            <hr className="divider" />

            {/* Descripción del pedido */}
            <div className="info-block">
              <div className="section-title">Descripción del Pedido</div>
              <div className="descripcion-box">{notasLimpias}</div>
            </div>

            {/* Entrega y envío */}
            <div className="info-block">
              <div className="entrega-row">
                <span className="entrega-label">Fecha de entrega</span>
                <span className="entrega-value">📅 {fmtDate(pedido.fechaEntrega)}</span>
              </div>
              <div>
                <span className={`envio-badge ${tieneEnvio ? 'envio-si' : 'envio-no'}`}>
                  {tieneEnvio ? '🚗 Con envío' : '🏪 Retira en tienda'}
                </span>
              </div>
            </div>

            <hr className="divider" />

            {/* Pagos */}
            <div className="info-block">
              <div className="section-title">Historial de Pagos</div>
              {pagos.length === 0 ? (
                <div className="pagos-empty">Sin pagos registrados</div>
              ) : (
                <table className="pagos-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th style={{ textAlign: 'right' }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map(pg => (
                      <tr key={pg.id}>
                        <td>{fmtDateTime(pg.fecha)}</td>
                        <td>{pg.metodoPago}</td>
                        <td>{fmt(pg.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <hr className="divider" />

            {/* Totales */}
            <div className="totales">
              <div className="totales-row">
                <span>Monto total</span>
                <span>{fmt(pedido.montoTotal)}</span>
              </div>
              <div className="totales-row">
                <span>Total pagado</span>
                <span style={{ color: '#28825a' }}>{fmt(totalPagado)}</span>
              </div>
              <div className={`totales-row ${pedido.saldoPendiente > 0 ? 'saldo-row' : 'saldo-ok'}`}>
                <span>Saldo pendiente</span>
                <span>{fmt(pedido.saldoPendiente)}</span>
              </div>
              <div className="totales-row total-final">
                <span>TOTAL</span>
                <span>{fmt(pedido.montoTotal)}</span>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="comanda-footer">
            Gracias por su preferencia · David's Bakery
          </div>
        </div>
      </div>
    </>
  )
}
