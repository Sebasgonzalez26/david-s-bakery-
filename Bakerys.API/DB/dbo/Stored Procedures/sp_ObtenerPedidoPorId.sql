CREATE PROCEDURE sp_ObtenerPedidoPorId
    @PedidoId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Pedidos WHERE PedidoId = @PedidoId)
    BEGIN
        RAISERROR('Pedido no encontrado.', 16, 1);
        RETURN;
    END

    -- Result Set 1: Encabezado
    SELECT
        p.PedidoId                                      AS Id,
        c.ClienteId,
        c.Nombre                                        AS Cliente,
        c.Telefono,
        e.EstadoId,
        e.Nombre                                        AS Estado,
        p.FechaEntrega,
        p.MontoTotal,
        ISNULL(SUM(pg.Monto), 0)                        AS TotalPagado,
        p.MontoTotal - ISNULL(SUM(pg.Monto), 0)         AS SaldoPendiente,
        p.ImagenReferenciaUrl,
        p.Notas,
        p.FechaCreacion
    FROM Pedidos p
        INNER JOIN Clientes      c  ON c.ClienteId = p.ClienteId
        INNER JOIN EstadosPedido e  ON e.EstadoId  = p.EstadoId
        LEFT JOIN  Pagos         pg ON pg.PedidoId = p.PedidoId
    WHERE p.PedidoId = @PedidoId
    GROUP BY
        p.PedidoId, c.ClienteId, c.Nombre, c.Telefono,
        e.EstadoId, e.Nombre, p.FechaEntrega, p.MontoTotal,
        p.ImagenReferenciaUrl, p.Notas, p.FechaCreacion;

    -- Result Set 2: Detalles
    SELECT
        DetallePedidoId                     AS Id,
        PedidoId,
        Descripcion,
        Sabor,
        Tamanio,
        Decoracion,
        Cantidad,
        PrecioUnitario,
        Cantidad * PrecioUnitario           AS Subtotal
    FROM DetallesPedido
    WHERE PedidoId = @PedidoId;

    -- Result Set 3: Pagos
    SELECT
        PagoId          AS Id,
        PedidoId,
        Monto,
        TipoPago,
        FechaPago,
        ComprobanteUrl,
        Notas
    FROM Pagos
    WHERE PedidoId = @PedidoId
    ORDER BY FechaPago ASC;
END