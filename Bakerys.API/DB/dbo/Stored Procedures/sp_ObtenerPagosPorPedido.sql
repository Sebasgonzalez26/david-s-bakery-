CREATE PROCEDURE sp_ObtenerPagosPorPedido
    @PedidoId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Pedidos WHERE PedidoId = @PedidoId)
    BEGIN
        RAISERROR('El pedido no existe.', 16, 1);
        RETURN;
    END

    -- Result Set 1: Pagos (el único que lee la API)
    SELECT
        pg.PagoId       AS Id,
        pg.PedidoId,
        pg.Monto,
        pg.TipoPago,
        pg.FechaPago,
        pg.ComprobanteUrl,
        pg.Notas
    FROM Pagos pg
    WHERE pg.PedidoId = @PedidoId
    ORDER BY pg.FechaPago ASC;
END