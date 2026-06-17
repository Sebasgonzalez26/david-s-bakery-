
-- =====================================================================
-- SP: sp_ActivarCliente
-- Reactiva un cliente que fue dado de baja lógicamente.
-- =====================================================================
CREATE PROCEDURE sp_ActivarCliente
    @ClienteId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Clientes WHERE ClienteId = @ClienteId AND Activo = 0)
    BEGIN
        RAISERROR('Cliente no encontrado o ya está activo.', 16, 1);
        RETURN;
    END

    UPDATE Clientes
    SET Activo = 1
    WHERE ClienteId = @ClienteId;

    SELECT @ClienteId;
END
