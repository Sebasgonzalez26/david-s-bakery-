
-- =====================================================================
-- SP 4: sp_ActualizarCliente
-- Edita los datos de un cliente existente.
-- =====================================================================
CREATE   PROCEDURE sp_ActualizarCliente
    @ClienteId INT,
    @Nombre    NVARCHAR(100),
    @Telefono  NVARCHAR(20),
    @Email     NVARCHAR(150) = NULL,
    @Notas     NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar que el cliente exista
    IF NOT EXISTS (SELECT 1 FROM Clientes WHERE ClienteId = @ClienteId AND Activo = 1)
    BEGIN
        RAISERROR('Cliente no encontrado o inactivo.', 16, 1);
        RETURN;
    END

    -- Validar que el teléfono no lo use OTRO cliente
    IF EXISTS (
        SELECT 1 FROM Clientes
        WHERE Telefono = @Telefono
          AND ClienteId <> @ClienteId
          AND Activo = 1
    )
    BEGIN
        RAISERROR('Ese teléfono ya está registrado en otro cliente.', 16, 1);
        RETURN;
    END

    UPDATE Clientes
    SET
        Nombre    = @Nombre,
        Telefono  = @Telefono,
        Email     = @Email,
        Notas     = @Notas
    WHERE ClienteId = @ClienteId;

    SELECT @ClienteId;
END