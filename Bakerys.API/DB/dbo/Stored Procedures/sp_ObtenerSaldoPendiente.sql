
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

    -- Devuelve solo el saldo pendiente como valor decimal
    SELECT
        p.MontoTotal - ISNULL(SUM(pg.Monto), 0) AS SaldoPendiente
    FROM Pedidos p
        LEFT JOIN Pagos pg ON pg.PedidoId = p.PedidoId
    WHERE p.PedidoId = @PedidoId
    GROUP BY p.MontoTotal;
END