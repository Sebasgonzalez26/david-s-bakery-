
-- =====================================================================
-- SP 2: sp_ObtenerPagosPorPedido
-- Lista todos los pagos de un pedido con el resumen de saldo al final.
-- Devuelve 2 result sets: historial de pagos + resumen financiero.
-- =====================================================================
CREATE   PROCEDURE sp_ObtenerPagosPorPedido
    @PedidoId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar que el pedido exista
    IF NOT EXISTS (SELECT 1 FROM Pedidos WHERE PedidoId = @PedidoId)
    BEGIN
        RAISERROR('El pedido no existe.', 16, 1);
        RETURN;
    END

    -- Result Set 1: Historial de pagos
    SELECT
        pg.PagoId,
        pg.Monto,
        pg.TipoPago,
        pg.FechaPago,
        pg.ComprobanteUrl,
        pg.Notas
    FROM Pagos pg
    WHERE pg.PedidoId = @PedidoId
    ORDER BY pg.FechaPago ASC;

    -- Result Set 2: Resumen financiero del pedido
    SELECT
        p.PedidoId,
        c.Nombre                                        AS Cliente,
        e.Nombre                                        AS Estado,
        p.FechaEntrega,
        p.MontoTotal,
        ISNULL(SUM(pg.Monto), 0)                        AS TotalPagado,
        p.MontoTotal - ISNULL(SUM(pg.Monto), 0)         AS SaldoPendiente,
        COUNT(pg.PagoId)                                AS CantidadPagos
    FROM Pedidos p
        INNER JOIN Clientes      c  ON c.ClienteId = p.ClienteId
        INNER JOIN EstadosPedido e  ON e.EstadoId  = p.EstadoId
        LEFT JOIN  Pagos         pg ON pg.PedidoId = p.PedidoId
    WHERE p.PedidoId = @PedidoId
    GROUP BY
        p.PedidoId, c.Nombre, e.Nombre,
        p.FechaEntrega, p.MontoTotal;
END