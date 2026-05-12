
-- =====================================================================
-- SP 3: sp_ObtenerClientePorId
-- Trae un cliente específico con el conteo de sus pedidos.
-- =====================================================================
CREATE   PROCEDURE sp_ObtenerClientePorId
    @ClienteId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Datos del cliente
    SELECT
        c.ClienteId,
        c.Nombre,
        c.Telefono,
        c.Email,
        c.Notas,
        c.FechaRegistro,
        COUNT(p.PedidoId)  AS TotalPedidos
    FROM Clientes c
        LEFT JOIN Pedidos p ON p.ClienteId = c.ClienteId
    WHERE c.ClienteId = @ClienteId
      AND c.Activo = 1
    GROUP BY
        c.ClienteId, c.Nombre, c.Telefono,
        c.Email, c.Notas, c.FechaRegistro;

    -- Sus pedidos recientes (últimos 10)
    SELECT TOP 10
        p.PedidoId,
        e.Nombre      AS Estado,
        p.FechaEntrega,
        p.MontoTotal,
        ISNULL(SUM(pg.Monto), 0)                AS TotalPagado,
        p.MontoTotal - ISNULL(SUM(pg.Monto), 0) AS SaldoPendiente
    FROM Pedidos p
        INNER JOIN EstadosPedido e ON e.EstadoId  = p.EstadoId
        LEFT JOIN  Pagos         pg ON pg.PedidoId = p.PedidoId
    WHERE p.ClienteId = @ClienteId
    GROUP BY
        p.PedidoId, e.Nombre, p.FechaEntrega, p.MontoTotal, p.FechaCreacion
    ORDER BY p.FechaCreacion DESC;
END