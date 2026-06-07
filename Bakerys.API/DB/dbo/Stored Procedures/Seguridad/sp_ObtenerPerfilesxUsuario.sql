CREATE PROCEDURE [dbo].[ObtenerPerfilesxUsuario]
    @NombreUsuario     NVARCHAR(50)  = NULL,
    @CorreoElectronico NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.Id,
        p.Nombre
    FROM Perfiles p
    INNER JOIN PerfilesxUsuario pu ON p.Id = pu.PerfilId
    INNER JOIN Usuarios u          ON u.Id = pu.UsuarioId
    WHERE
        u.Activo = 1
        AND (@NombreUsuario     IS NULL OR u.NombreUsuario     = @NombreUsuario)
        AND (@CorreoElectronico IS NULL OR u.CorreoElectronico = @CorreoElectronico);
END
