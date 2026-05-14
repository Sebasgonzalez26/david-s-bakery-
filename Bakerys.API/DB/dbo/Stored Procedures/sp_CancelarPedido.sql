
-- =====================================================================
-- SP 6: sp_CancelarPedido
-- Cancela un pedido y guarda el motivo en Notas.
-- No se puede cancelar si ya fue entregado.
-- =====================================================================
CREATE   PROCEDURE sp_CancelarPedido
    @PedidoId INT,
    @Motivo   NVARCHAR(300) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @EstadoNombre NVARCHAR(50);
    DECLARE @EstadoCancelado INT;

    -- Validar que el pedido exista
    IF NOT EXISTS (SELECT 1 FROM Pedidos WHERE PedidoId = @PedidoId)
    BEGIN
        RAISERROR('Pedido no encontrado.', 16, 1);
        RETURN;
    END

    -- Obtener estado actual
    SELECT @EstadoNombre = e.Nombre
    FROM Pedidos p
        INNER JOIN EstadosPedido e ON e.EstadoId = p.EstadoId
    WHERE p.PedidoId = @PedidoId;

    -- No cancelar si ya fue entregado
    IF @EstadoNombre = 'Entregado'
    BEGIN
        RAISERROR('No se puede cancelar un pedido que ya fue entregado.', 16, 1);
        RETURN;
    END

    -- No cancelar si ya estaba cancelado
    IF @EstadoNombre = 'Cancelado'
    BEGIN
        RAISERROR('El pedido ya estaba cancelado.', 16, 1);
        RETURN;
    END

    SELECT @EstadoCancelado = EstadoId FROM EstadosPedido WHERE Nombre = 'Cancelado';

    UPDATE Pedidos
    SET
        EstadoId           = @EstadoCancelado,
        Notas              = ISNULL(Notas + ' | ', '') + 'CANCELADO: ' + ISNULL(@Motivo, 'Sin motivo especificado'),
        FechaActualizacion = GETDATE()
    WHERE PedidoId = @PedidoId;

    SELECT @PedidoId;
END