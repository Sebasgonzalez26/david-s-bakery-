CREATE PROCEDURE [dbo].[ValidarTokenRecuperacion]
    @Token NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT t.Id, t.UsuarioId, t.Token, t.FechaExpiracion, t.Usado
    FROM TokensRecuperacion t
    WHERE t.Token = @Token
      AND t.Usado = 0
      AND t.FechaExpiracion > GETDATE();
END
