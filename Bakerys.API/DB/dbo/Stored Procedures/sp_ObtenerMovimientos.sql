-- =====================================================================
-- SP: sp_ObtenerMovimientos
-- Lista todos los movimientos de inventario con el nombre del producto.
-- =====================================================================
CREATE PROCEDURE sp_ObtenerMovimientos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        m.MovimientoId    AS Id,
        m.ProductoId,
        p.Nombre          AS ProductoNombre,
        m.TipoMovimiento,
        m.Cantidad,
        m.Fecha,
        m.Notas
    FROM MovimientosInventario m
    INNER JOIN ProductosInventario p ON m.ProductoId = p.ProductoId
    ORDER BY m.Fecha DESC;
END
