CREATE PROCEDURE sp_ObtenerClientePorId
    @ClienteId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        c.ClienteId     AS Id,
        c.Nombre,
        c.Telefono,
        c.Email,
        c.Notas,
        c.Activo,
        c.FechaRegistro
    FROM Clientes c
    WHERE c.ClienteId = @ClienteId;
END