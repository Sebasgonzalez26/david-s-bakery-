CREATE PROCEDURE sp_ObtenerPagosPorPedido
    @PedidoId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Pagos
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