
-- =====================================================================
-- SP 3: sp_ObtenerSaldoPendiente
-- Devuelve el resumen financiero rápido de un pedido.
-- Útil para validar antes de registrar un pago.
-- =====================================================================
CREATE   PROCEDURE sp_ObtenerSaldoPendiente
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

    SELECT
        p.PedidoId,
        c.Nombre                                        AS Cliente,
        e.Nombre                                        AS Estado,
        p.MontoTotal,
        ISNULL(SUM(pg.Monto), 0)                        AS TotalPagado,
        p.MontoTotal - ISNULL(SUM(pg.Monto), 0)         AS SaldoPendiente,
        CASE
            WHEN p.MontoTotal - ISNULL(SUM(pg.Monto), 0) = 0
            THEN 'Pagado completo'
            ELSE 'Pendiente de pago'
        END                                             AS EstadoPago
    FROM Pedidos p
        INNER JOIN Clientes      c  ON c.ClienteId = p.ClienteId
        INNER JOIN EstadosPedido e  ON e.EstadoId  = p.EstadoId
        LEFT JOIN  Pagos         pg ON pg.PedidoId = p.PedidoId
    WHERE p.PedidoId = @PedidoId
    GROUP BY
        p.PedidoId, c.Nombre, e.Nombre,
        p.MontoTotal;
END