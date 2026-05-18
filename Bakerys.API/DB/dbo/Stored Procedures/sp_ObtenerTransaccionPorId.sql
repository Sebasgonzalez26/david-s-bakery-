-- =====================================================================
-- SP 2: sp_ObtenerTransaccionPorId
-- Trae el detalle de una transacción específica.
-- =====================================================================
CREATE PROCEDURE sp_ObtenerTransaccionPorId
    @TransaccionId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM TransaccionesFinanzas WHERE TransaccionId = @TransaccionId)
    BEGIN
        RAISERROR('La transacción no existe.', 16, 1);
        RETURN;
    END

    SELECT
        TransaccionId   AS Id,
        Tipo,
        Categoria,
        Descripcion,
        Monto,
        Fecha
    FROM TransaccionesFinanzas
    WHERE TransaccionId = @TransaccionId;
END
