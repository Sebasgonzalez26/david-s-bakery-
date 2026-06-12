CREATE PROCEDURE [dbo].[CrearTokenRecuperacion]
    @CorreoElectronico NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UsuarioId UNIQUEIDENTIFIER;
    SELECT @UsuarioId = Id FROM Usuarios
    WHERE CorreoElectronico = @CorreoElectronico AND Activo = 1;

    -- No revelar si el correo existe o no
    IF @UsuarioId IS NULL
    BEGIN
        SELECT NULL AS Token;
        RETURN;
    END

    -- Invalidar tokens anteriores del mismo usuario
    UPDATE TokensRecuperacion SET Usado = 1
    WHERE UsuarioId = @UsuarioId AND Usado = 0;

    DECLARE @Token           NVARCHAR(100) = CAST(NEWID() AS NVARCHAR(100));
    DECLARE @FechaExpiracion DATETIME2     = DATEADD(HOUR, 1, GETDATE());

    INSERT INTO TokensRecuperacion (UsuarioId, Token, FechaExpiracion)
    VALUES (@UsuarioId, @Token, @FechaExpiracion);

    SELECT @Token AS Token;
END
