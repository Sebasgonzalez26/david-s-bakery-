-- =====================================================================
-- SP: sp_ObtenerPagos
-- Lista todos los pagos con el nombre del cliente.
-- =====================================================================
CREATE PROCEDURE sp_ObtenerPagos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        pg.PagoId       AS Id,
        pg.PedidoId,
        c.Nombre        AS ClienteNombre,
        pg.Monto,
        pg.TipoPago     AS MetodoPago,
        pg.FechaPago    AS Fecha,
        pg.Notas
    FROM Pagos pg
    INNER JOIN Pedidos  p ON pg.PedidoId = p.PedidoId
    INNER JOIN Clientes c ON p.ClienteId = c.ClienteId
    ORDER BY pg.FechaPago DESC;
END
