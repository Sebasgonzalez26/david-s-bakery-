-- =====================================================================
-- VISTA: Vista_ResumenPedidos
-- David puede ver de un vistazo: cliente, estado, cuánto pagó y cuánto falta
-- =====================================================================
CREATE VIEW Vista_ResumenPedidos AS
SELECT
    p.PedidoId,
    c.Nombre           AS Cliente,
    c.Telefono,
    e.Nombre           AS Estado,
    p.FechaEntrega,
    p.MontoTotal,
    ISNULL(SUM(pg.Monto), 0)                    AS TotalPagado,
    p.MontoTotal - ISNULL(SUM(pg.Monto), 0)     AS SaldoPendiente,
    p.FechaCreacion
FROM Pedidos p
    INNER JOIN Clientes      c  ON c.ClienteId = p.ClienteId
    INNER JOIN EstadosPedido e  ON e.EstadoId  = p.EstadoId
    LEFT JOIN  Pagos         pg ON pg.PedidoId = p.PedidoId
GROUP BY
    p.PedidoId, c.Nombre, c.Telefono, e.Nombre,
    p.FechaEntrega, p.MontoTotal, p.FechaCreacion;