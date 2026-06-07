CREATE PROCEDURE [dbo].[AgregarUsuario]
    @NombreUsuario     NVARCHAR(50),
    @CorreoElectronico NVARCHAR(100),
    @PasswordHash      NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Usuarios WHERE NombreUsuario = @NombreUsuario OR CorreoElectronico = @CorreoElectronico)
    BEGIN
        RAISERROR('Ya existe un usuario con ese nombre o correo.', 16, 1);
        RETURN;
    END

    DECLARE @NuevoId UNIQUEIDENTIFIER = NEWID();

    INSERT INTO Usuarios (Id, NombreUsuario, CorreoElectronico, PasswordHash)
    VALUES (@NuevoId, @NombreUsuario, @CorreoElectronico, @PasswordHash);

    -- Asignar perfil Administrador automáticamente
    DECLARE @PerfilId UNIQUEIDENTIFIER = (SELECT Id FROM Perfiles WHERE Nombre = 'Administrador');
    INSERT INTO PerfilesxUsuario (UsuarioId, PerfilId) VALUES (@NuevoId, @PerfilId);

    SELECT @NuevoId AS Id;
END
