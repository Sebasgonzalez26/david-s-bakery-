
-- =====================================================================
-- SP 5: sp_ActualizarEstadoPedido
-- Cambia el estado del pedido siguiendo el flujo lógico:
-- Pendiente → En Proceso → Listo → Entregado
-- No se puede retroceder ni saltar pasos (excepto Cancelado).
-- =====================================================================
CREATE   PROCEDURE sp_ActualizarEstadoPedido
    @PedidoId    INT,
    @NuevoEstado INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @EstadoActual INT;
    DECLARE @NombreActual NVARCHAR(50);
    DECLARE @NombreNuevo  NVARCHAR(50);

    -- Validar que el pedido exista
    IF NOT EXISTS (SELECT 1 FROM Pedidos WHERE PedidoId = @PedidoId)
    BEGIN
        RAISERROR('Pedido no encontrado.', 16, 1);
        RETURN;
    END

    -- Obtener estado actual
    SELECT @EstadoActual = EstadoId FROM Pedidos WHERE PedidoId = @PedidoId;
    SELECT @NombreActual = Nombre   FROM EstadosPedido WHERE EstadoId = @EstadoActual;
    SELECT @NombreNuevo  = Nombre   FROM EstadosPedido WHERE EstadoId = @NuevoEstado;

    -- No mover un pedido ya cancelado o entregado
    IF @NombreActual IN ('Cancelado', 'Entregado')
    BEGIN
        RAISERROR('No se puede cambiar el estado de un pedido cancelado o entregado.', 16, 1);
        RETURN;
    END

    -- Validar flujo lógico: no retroceder estados
    IF @NuevoEstado < @EstadoActual AND @NombreNuevo <> 'Cancelado'
    BEGIN
        RAISERROR('No se puede retroceder el estado del pedido.', 16, 1);
        RETURN;
    END

    UPDATE Pedidos
    SET
        EstadoId           = @NuevoEstado,
        FechaActualizacion = GETDATE()
    WHERE PedidoId = @PedidoId;

    SELECT
        p.PedidoId,
        c.Nombre  AS Cliente,
        e.Nombre  AS Estado,
        p.FechaActualizacion
    FROM Pedidos p
        INNER JOIN Clientes      c ON c.ClienteId = p.ClienteId
        INNER JOIN EstadosPedido e ON e.EstadoId  = p.EstadoId
    WHERE p.PedidoId = @PedidoId;
END