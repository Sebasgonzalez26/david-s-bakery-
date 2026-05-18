CREATE PROCEDURE sp_ObtenerClientes
    @Busqueda NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ClienteId     AS Id,
        Nombre,
        Telefono,
        Email,
        Notas,
        Activo,
        FechaRegistro
    FROM Clientes
    WHERE (
            @Busqueda IS NULL
            OR Nombre   LIKE '%' + @Busqueda + '%'
            OR Telefono LIKE '%' + @Busqueda + '%'
          )
    ORDER BY Nombre ASC;
END