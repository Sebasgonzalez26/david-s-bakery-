-- =====================================================================
-- SP 5: sp_EliminarTransaccion
-- Elimina una transacción (borrado real — corrección contable).
-- =====================================================================
CREATE PROCEDURE sp_EliminarTransaccion
    @TransaccionId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM TransaccionesFinanzas WHERE TransaccionId = @TransaccionId)
    BEGIN
        RAISERROR('La transacción no existe.', 16, 1);
        RETURN;
    END

    DELETE FROM TransaccionesFinanzas
    WHERE TransaccionId = @TransaccionId;

    SELECT @TransaccionId;
END
