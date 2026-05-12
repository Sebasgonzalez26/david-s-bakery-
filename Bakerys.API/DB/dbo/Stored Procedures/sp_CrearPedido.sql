
-- =====================================================================
-- SP 1: sp_CrearPedido
-- Crea el encabezado del pedido.
-- Los detalles se agregan después con sp_AgregarDetallePedido.
-- La API maneja la transacción completa (pedido + detalles juntos).
-- =====================================================================
CREATE   PROCEDURE sp_CrearPedido
    @ClienteId           INT,
    @FechaEntrega        DATE,
    @MontoTotal          DECIMAL(10,2),
    @ImagenReferenciaUrl NVARCHAR(500) = NULL,
    @Notas               NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar que el cliente exista y esté activo
    IF NOT EXISTS (SELECT 1 FROM Clientes WHERE ClienteId = @ClienteId AND Activo = 1)
    BEGIN
        RAISERROR('El cliente no existe o está inactivo.', 16, 1);
        RETURN;
    END

    -- Validar que la fecha de entrega no sea en el pasado
    IF @FechaEntrega < CAST(GETDATE() AS DATE)
    BEGIN
        RAISERROR('La fecha de entrega no puede ser en el pasado.', 16, 1);
        RETURN;
    END

    -- Validar monto
    IF @MontoTotal <= 0
    BEGIN
        RAISERROR('El monto total debe ser mayor a cero.', 16, 1);
        RETURN;
    END

    INSERT INTO Pedidos (ClienteId, FechaEntrega, MontoTotal, ImagenReferenciaUrl, Notas)
    VALUES (@ClienteId, @FechaEntrega, @MontoTotal, @ImagenReferenciaUrl, @Notas);

    -- Devuelve el pedido recién creado con datos del cliente y estado
    SELECT
        p.PedidoId,
        c.Nombre      AS Cliente,
        c.Telefono,
        e.Nombre      AS Estado,
        p.FechaEntrega,
        p.MontoTotal,
        p.Notas,
        p.FechaCreacion
    FROM Pedidos p
        INNER JOIN Clientes      c ON c.ClienteId = p.ClienteId
        INNER JOIN EstadosPedido e ON e.EstadoId  = p.EstadoId
    WHERE p.PedidoId = SCOPE_IDENTITY();
END