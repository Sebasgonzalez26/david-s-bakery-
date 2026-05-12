
-- =====================================================================
-- SP 2: sp_ObtenerClientes
-- Lista todos los clientes activos.
-- Si se pasa @Busqueda, filtra por nombre o teléfono.
-- =====================================================================
CREATE   PROCEDURE sp_ObtenerClientes
    @Busqueda NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ClienteId,
        Nombre,
        Telefono,
        Email,
        Notas,
        FechaRegistro
    FROM Clientes
    WHERE Activo = 1
      AND (
            @Busqueda IS NULL
            OR Nombre   LIKE '%' + @Busqueda + '%'
            OR Telefono LIKE '%' + @Busqueda + '%'
          )
    ORDER BY Nombre ASC;
END