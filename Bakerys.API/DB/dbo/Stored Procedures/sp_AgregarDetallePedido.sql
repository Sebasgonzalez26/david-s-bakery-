
-- =====================================================================
-- SP 2: sp_AgregarDetallePedido
-- Agrega un ítem al pedido (sabor, tamaño, decoración, precio).
-- Se llama una vez por cada producto del pedido.
-- =====================================================================
CREATE   PROCEDURE sp_AgregarDetallePedido
    @PedidoId       INT,
    @Descripcion    NVARCHAR(200),
    @Sabor          NVARCHAR(100) = NULL,
    @Tamanio        NVARCHAR(50)  = NULL,
    @Decoracion     NVARCHAR(300) = NULL,
    @Cantidad       INT           = 1,
    @PrecioUnitario DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar que el pedido exista
    IF NOT EXISTS (SELECT 1 FROM Pedidos WHERE PedidoId = @PedidoId)
    BEGIN
        RAISERROR('El pedido no existe.', 16, 1);
        RETURN;
    END

    -- No agregar detalles a un pedido cancelado o entregado
    IF EXISTS (
        SELECT 1
        FROM Pedidos p
            INNER JOIN EstadosPedido e ON e.EstadoId = p.EstadoId
        WHERE p.PedidoId = @PedidoId
          AND e.Nombre IN ('Cancelado', 'Entregado')
    )
    BEGIN
        RAISERROR('No se pueden agregar detalles a un pedido cancelado o entregado.', 16, 1);
        RETURN;
    END

    INSERT INTO DetallesPedido (PedidoId, Descripcion, Sabor, Tamanio, Decoracion, Cantidad, PrecioUnitario)
    VALUES (@PedidoId, @Descripcion, @Sabor, @Tamanio, @Decoracion, @Cantidad, @PrecioUnitario);

    SELECT * FROM DetallesPedido WHERE DetallePedidoId = SCOPE_IDENTITY();
END