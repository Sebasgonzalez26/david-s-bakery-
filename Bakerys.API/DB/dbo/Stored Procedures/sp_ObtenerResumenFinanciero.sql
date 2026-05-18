-- =====================================================================
-- SP 6: sp_ObtenerResumenFinanciero
-- Devuelve el balance financiero de un período.
-- Útil para el dashboard: ingresos, gastos y balance neto.
-- =====================================================================
CREATE PROCEDURE sp_ObtenerResumenFinanciero
    @FechaDesde DATETIME = NULL,
    @FechaHasta DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Si no se pasan fechas se toma el mes actual
    IF @FechaDesde IS NULL
        SET @FechaDesde = DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1);
    IF @FechaHasta IS NULL
        SET @FechaHasta = GETDATE();

    SELECT
        ISNULL(SUM(CASE WHEN Tipo = 'Ingreso' THEN Monto ELSE 0 END), 0)  AS TotalIngresos,
        ISNULL(SUM(CASE WHEN Tipo = 'Gasto'   THEN Monto ELSE 0 END), 0)  AS TotalGastos,
        ISNULL(SUM(CASE WHEN Tipo = 'Ingreso' THEN Monto ELSE 0 END), 0) -
        ISNULL(SUM(CASE WHEN Tipo = 'Gasto'   THEN Monto ELSE 0 END), 0)  AS BalanceNeto,
        @FechaDesde                                                         AS FechaDesde,
        @FechaHasta                                                         AS FechaHasta
    FROM TransaccionesFinanzas
    WHERE Fecha >= @FechaDesde
      AND Fecha <= @FechaHasta;
END
