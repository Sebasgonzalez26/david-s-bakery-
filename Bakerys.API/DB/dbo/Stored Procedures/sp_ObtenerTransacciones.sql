-- =====================================================================
-- SP 1: sp_ObtenerTransacciones
-- Lista transacciones con filtros opcionales.
-- =====================================================================
CREATE PROCEDURE sp_ObtenerTransacciones
    @Tipo       NVARCHAR(10)  = NULL,   -- Ingreso | Gasto
    @Categoria  NVARCHAR(50)  = NULL,
    @FechaDesde DATETIME      = NULL,
    @FechaHasta DATETIME      = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TransaccionId   AS Id,
        Tipo,
        Categoria,
        Descripcion,
        Monto,
        Fecha
    FROM TransaccionesFinanzas
    WHERE
        (@Tipo       IS NULL OR Tipo      = @Tipo)
        AND (@Categoria  IS NULL OR Categoria = @Categoria)
        AND (@FechaDesde IS NULL OR Fecha  >= @FechaDesde)
        AND (@FechaHasta IS NULL OR Fecha  <= @FechaHasta)
    ORDER BY Fecha DESC;
END
