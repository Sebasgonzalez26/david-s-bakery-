
-- =====================================================================
-- SP 1: sp_RegistrarPago
-- Registra un pago sobre un pedido existente.
-- Valida que el monto no supere el saldo pendiente.
-- =====================================================================
CREATE   PROCEDURE sp_RegistrarPago
    @PedidoId       INT,
    @Monto          DECIMAL(10,2),
    @TipoPago       NVARCHAR(50)  = 'Adelanto',   -- Adelanto | Abono | Saldo Total
    @ComprobanteUrl NVARCHAR(500) = NULL,
    @Notas          NVARCHAR(300) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MontoTotal     DECIMAL(10,2);
    DECLARE @TotalPagado    DECIMAL(10,2);
    DECLARE @SaldoPendiente DECIMAL(10,2);
    DECLARE @EstadoNombre   NVARCHAR(50);

    -- Validar que el pedido exista
    IF NOT EXISTS (SELECT 1 FROM Pedidos WHERE PedidoId = @PedidoId)
    BEGIN
        RAISERROR('El pedido no existe.', 16, 1);
        RETURN;
    END

    -- No registrar pagos en pedidos cancelados o entregados
    SELECT @EstadoNombre = e.Nombre
    FROM Pedidos p
        INNER JOIN EstadosPedido e ON e.EstadoId = p.EstadoId
    WHERE p.PedidoId = @PedidoId;

    IF @EstadoNombre IN ('Cancelado', 'Entregado')
    BEGIN
        RAISERROR('No se pueden registrar pagos en un pedido cancelado o entregado.', 16, 1);
        RETURN;
    END

    -- Validar monto mayor a cero
    IF @Monto <= 0
    BEGIN
        RAISERROR('El monto del pago debe ser mayor a cero.', 16, 1);
        RETURN;
    END

    -- Calcular saldo pendiente actual
    SELECT @MontoTotal  = MontoTotal FROM Pedidos WHERE PedidoId = @PedidoId;
    SELECT @TotalPagado = ISNULL(SUM(Monto), 0) FROM Pagos WHERE PedidoId = @PedidoId;
    SET @SaldoPendiente = @MontoTotal - @TotalPagado;

    -- Validar que el pago no supere lo que falta
    IF @Monto > @SaldoPendiente
    BEGIN
        DECLARE @MsgError NVARCHAR(300);
        SET @MsgError = 'El monto ingresado (' + CAST(@Monto AS NVARCHAR(20)) +
                        ') supera el saldo pendiente (' + CAST(@SaldoPendiente AS NVARCHAR(20)) + ').';
        RAISERROR(@MsgError, 16, 1);
        RETURN;
    END

    -- Validar tipo de pago
    IF @TipoPago NOT IN ('Adelanto', 'Abono', 'Saldo Total')
    BEGIN
        RAISERROR('Tipo de pago inválido. Use: Adelanto, Abono o Saldo Total.', 16, 1);
        RETURN;
    END

    INSERT INTO Pagos (PedidoId, Monto, TipoPago, ComprobanteUrl, Notas)
    VALUES (@PedidoId, @Monto, @TipoPago, @ComprobanteUrl, @Notas);

    -- Devuelve el Id del pago recién registrado
    SELECT CAST(SCOPE_IDENTITY() AS INT);
END