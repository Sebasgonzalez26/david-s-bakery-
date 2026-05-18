-- =====================================================================
-- SP 7: sp_ObtenerMovimientosPorProducto
-- Lista el historial completo de movimientos de un producto.
-- =====================================================================
CREATE PROCEDURE sp_ObtenerMovimientosPorProducto
    @ProductoId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM ProductosInventario WHERE ProductoId = @ProductoId)
    BEGIN
        RAISERROR('El producto no existe.', 16, 1);
        RETURN;
    END

    SELECT
        MovimientoId    AS Id,
        ProductoId,
        TipoMovimiento,
        Cantidad,
        Fecha,
        Notas
    FROM MovimientosInventario
    WHERE ProductoId = @ProductoId
    ORDER BY Fecha DESC;
END
