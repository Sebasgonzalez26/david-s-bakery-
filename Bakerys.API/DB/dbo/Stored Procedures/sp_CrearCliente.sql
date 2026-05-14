
CREATE PROCEDURE sp_CrearCliente
    @Nombre    NVARCHAR(100),
    @Telefono  NVARCHAR(20),
    @Email     NVARCHAR(150) = NULL,
    @Notas     NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Clientes WHERE Telefono = @Telefono AND Activo = 1)
    BEGIN
        RAISERROR('Ya existe un cliente activo con ese teléfono.', 16, 1);
        RETURN;
    END

    INSERT INTO Clientes (Nombre, Telefono, Email, Notas)
    VALUES (@Nombre, @Telefono, @Email, @Notas);

    -- Solo devuelve el Id
    SELECT CAST(SCOPE_IDENTITY() AS INT);
END