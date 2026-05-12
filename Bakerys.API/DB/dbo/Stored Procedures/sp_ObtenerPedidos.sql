
-- =====================================================================
-- SP 3: sp_ObtenerPedidos
-- Lista pedidos con filtros opcionales: cliente, estado, rango de fechas.
-- Todos los filtros son opcionales — sin filtros trae todos.
-- =====================================================================
CREATE   PROCEDURE sp_ObtenerPedidos
    @ClienteId   INT  = NULL,
    @EstadoId    INT  = NULL,
    @FechaDesde  DATE = NULL,
    @FechaHasta  DATE = NULL,
    @Busqueda    NVARCHAR(100) = NULL   -- busca por nombre del cliente
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.PedidoId,
        c.ClienteId,
        c.Nombre                                        AS Cliente,
        c.Telefono,
        e.EstadoId,
        e.Nombre                                        AS Estado,
        p.FechaEntrega,
        p.MontoTotal,
        ISNULL(SUM(pg.Monto), 0)                        AS TotalPagado,
        p.MontoTotal - ISNULL(SUM(pg.Monto), 0)         AS SaldoPendiente,
        p.Notas,
        p.FechaCreacion
    FROM Pedidos p
        INNER JOIN Clientes      c  ON c.ClienteId = p.ClienteId
        INNER JOIN EstadosPedido e  ON e.EstadoId  = p.EstadoId
        LEFT JOIN  Pagos         pg ON pg.PedidoId = p.PedidoId
    WHERE
        (@ClienteId IS NULL OR p.ClienteId = @ClienteId)
        AND (@EstadoId  IS NULL OR p.EstadoId  = @EstadoId)
        AND (@FechaDesde IS NULL OR p.FechaEntrega >= @FechaDesde)
        AND (@FechaHasta IS NULL OR p.FechaEntrega <= @FechaHasta)
        AND (@Busqueda   IS NULL OR c.Nombre LIKE '%' + @Busqueda + '%')
    GROUP BY
        p.PedidoId, c.ClienteId, c.Nombre, c.Telefono,
        e.EstadoId, e.Nombre, p.FechaEntrega,
        p.MontoTotal, p.Notas, p.FechaCreacion
    ORDER BY p.FechaEntrega ASC;
END