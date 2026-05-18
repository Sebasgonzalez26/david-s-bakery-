-- =====================================================================
-- SP 3: sp_RegistrarTransaccion
-- Registra un ingreso o gasto en el sistema de finanzas.
-- =====================================================================
CREATE PROCEDURE sp_RegistrarTransaccion
    @Tipo        NVARCHAR(10),
    @Categoria   NVARCHAR(50),
    @Descripcion NVARCHAR(200) = NULL,
    @Monto       DECIMAL(10,2),
    @Fecha       DATETIME      = NULL
AS
BEGIN
    SET NOCOUNT ON;

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

    -- Si no se pasa fecha se usa la actual
    IF @Fecha IS NULL
        SET @Fecha = GETDATE();

    INSERT INTO TransaccionesFinanzas (Tipo, Categoria, Descripcion, Monto, Fecha)
    VALUES (@Tipo, @Categoria, @Descripcion, @Monto, @Fecha);

    SELECT CAST(SCOPE_IDENTITY() AS INT);
END
