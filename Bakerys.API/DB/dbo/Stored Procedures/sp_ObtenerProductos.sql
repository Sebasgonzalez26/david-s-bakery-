-- =====================================================================
-- SP 1: sp_ObtenerProductos
-- Lista productos con filtros opcionales.
-- Incluye indicador de stock bajo.
-- =====================================================================
CREATE PROCEDURE sp_ObtenerProductos
    @Categoria  NVARCHAR(50) = NULL,
    @SoloActivos BIT         = 1,
    @StockBajo  BIT          = 0    -- 1 = solo productos con stock bajo
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ProductoId          AS Id,
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
    WHERE
        (@Categoria  IS NULL OR Categoria = @Categoria)
        AND (@SoloActivos = 0 OR Activo = 1)
        AND (@StockBajo   = 0 OR StockActual <= StockMinimo)
    ORDER BY Nombre ASC;
END
