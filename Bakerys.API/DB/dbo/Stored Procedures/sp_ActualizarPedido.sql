-- =====================================================================
-- SP: sp_ActualizarPedido
-- Actualiza los datos editables de un pedido existente.
-- =====================================================================
CREATE PROCEDURE sp_ActualizarPedido
    @PedidoId     INT,
    @ClienteId    INT,
    @FechaEntrega DATE,
    @MontoTotal   DECIMAL(10,2),
    @Notas        NVARCHAR(1000) = NULL,
    @EstadoNombre NVARCHAR(50)  = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Pedidos WHERE PedidoId = @PedidoId)
    BEGIN
        RAISERROR('El pedido no existe.', 16, 1);
        RETURN;
    END

    DECLARE @EstadoId INT;

    IF @EstadoNombre IS NOT NULL
        SELECT @EstadoId = EstadoId FROM EstadosPedido WHERE Nombre = @EstadoNombre;

    UPDATE Pedidos
    SET
        ClienteId          = @ClienteId,
        FechaEntrega       = @FechaEntrega,
        MontoTotal         = @MontoTotal,
        Notas              = @Notas,
        EstadoId           = ISNULL(@EstadoId, EstadoId),
        FechaActualizacion = GETDATE()
    WHERE PedidoId = @PedidoId;

    SELECT @PedidoId;
END
