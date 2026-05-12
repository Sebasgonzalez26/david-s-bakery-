
-- =====================================================================
-- SP 1: sp_CrearCliente
-- Registra un cliente nuevo.
-- Valida que no exista otro cliente con el mismo teléfono.
-- =====================================================================
CREATE   PROCEDURE sp_CrearCliente
    @Nombre    NVARCHAR(100),
    @Telefono  NVARCHAR(20),
    @Email     NVARCHAR(150) = NULL,
    @Notas     NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar que el teléfono no esté registrado ya
    IF EXISTS (SELECT 1 FROM Clientes WHERE Telefono = @Telefono AND Activo = 1)
    BEGIN
        RAISERROR('Ya existe un cliente activo con ese teléfono.', 16, 1);
        RETURN;
    END

    INSERT INTO Clientes (Nombre, Telefono, Email, Notas)
    VALUES (@Nombre, @Telefono, @Email, @Notas);

    -- Devuelve el cliente recién creado
    SELECT * FROM Clientes WHERE ClienteId = SCOPE_IDENTITY();
END