CREATE PROCEDURE [dbo].[ActualizarPassword]
    @Token        NVARCHAR(100),
    @PasswordHash NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UsuarioId UNIQUEIDENTIFIER;

    SELECT @UsuarioId = UsuarioId
    FROM TokensRecuperacion
    WHERE Token = @Token AND Usado = 0 AND FechaExpiracion > GETDATE();

    IF @UsuarioId IS NULL
    BEGIN
        RAISERROR('Token inválido o expirado.', 16, 1);
        RETURN;
    END

    UPDATE Usuarios        SET PasswordHash = @PasswordHash WHERE Id    = @UsuarioId;
    UPDATE TokensRecuperacion SET Usado     = 1             WHERE Token = @Token;
END
