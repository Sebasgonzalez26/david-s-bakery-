-- =====================================================================
-- SP 4: sp_ActualizarTransaccion
-- Edita una transacción existente.
-- =====================================================================
CREATE PROCEDURE sp_ActualizarTransaccion
    @TransaccionId INT,
    @Tipo          NVARCHAR(10),
    @Categoria     NVARCHAR(50),
    @Descripcion   NVARCHAR(200) = NULL,
    @Monto         DECIMAL(10,2),
    @Fecha         DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM TransaccionesFinanzas WHERE TransaccionId = @TransaccionId)
    BEGIN
        RAISERROR('La transacción no existe.', 16, 1);
        RETURN;
    END

    IF @Tipo NOT IN ('Ingreso', 'Gasto')
    BEGIN
        RAISERROR('Tipo inválido. Use: Ingreso o Gasto.', 16, 1);
        RETURN;
    END

    IF @Monto <= 0
    BEGIN
        RAISERROR('El monto debe ser mayor a cero.', 16, 1);
        RETURN;
    END

    UPDATE TransaccionesFinanzas
    SET
        Tipo        = @Tipo,
        Categoria   = @Categoria,
        Descripcion = @Descripcion,
        Monto       = @Monto,
        Fecha       = @Fecha
    WHERE TransaccionId = @TransaccionId;

    SELECT @TransaccionId;
END
