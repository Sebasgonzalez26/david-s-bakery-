CREATE PROCEDURE [dbo].[ObtenerUsuario]
    @NombreUsuario     NVARCHAR(50)  = NULL,
    @CorreoElectronico NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        NombreUsuario,
        CorreoElectronico,
        PasswordHash,
        Activo
    FROM Usuarios
    WHERE
        Activo = 1
        AND (@NombreUsuario     IS NULL OR NombreUsuario     = @NombreUsuario)
        AND (@CorreoElectronico IS NULL OR CorreoElectronico = @CorreoElectronico);
END
