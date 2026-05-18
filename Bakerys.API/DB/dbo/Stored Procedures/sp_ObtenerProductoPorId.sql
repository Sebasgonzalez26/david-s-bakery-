-- =====================================================================
-- SP 2: sp_ObtenerProductoPorId
-- Trae el producto completo + sus últimos 10 movimientos.
-- Devuelve 2 result sets.
-- =====================================================================
CREATE PROCEDURE sp_ObtenerProductoPorId
    @ProductoId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM ProductosInventario WHERE ProductoId = @ProductoId)
    BEGIN
        RAISERROR('El producto no existe.', 16, 1);
        RETURN;
    END

    -- Result Set 1: Producto
    SELECT
        ProductoId      AS Id,
        Nombre,
        Categoria,
        UnidadMedida,
        StockActual,
        StockMinimo,
        PrecioUnitario,
        Activo,
        FechaCreacion,
        CASE WHEN StockActual <= StockMinimo THEN 1 ELSE 0 END AS StockBajo
    FROM ProductosInventario
    WHERE ProductoId = @ProductoId;

    -- Result Set 2: Últimos 10 movimientos
    SELECT TOP 10
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
