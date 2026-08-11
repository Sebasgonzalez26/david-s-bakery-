
-- =====================================================================
-- SP: sp_EditarPago
-- Edita monto, tipo de pago y notas de un pago existente.
-- Valida que el nuevo monto no supere el saldo pendiente del pedido
-- (excluyendo el monto actual del propio pago del cálculo).
-- =====================================================================
CREATE PROCEDURE sp_EditarPago
    @PagoId   INT,
    @Monto    DECIMAL(10,2),
    @TipoPago NVARCHAR(50),
    @Notas    NVARCHAR(300) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PedidoId       INT;
    DECLARE @MontoActual    DECIMAL(10,2);
    DECLARE @MontoTotal     DECIMAL(10,2);
    DECLARE @TotalPagado    DECIMAL(10,2);
    DECLARE @SaldoDisponible DECIMAL(10,2);

    IF NOT EXISTS (SELECT 1 FROM Pagos WHERE PagoId = @PagoId)
    BEGIN
        RAISERROR('Pago no encontrado.', 16, 1);
        RETURN;
    END

    IF @Monto <= 0
    BEGIN
        RAISERROR('El monto debe ser mayor a cero.', 16, 1);
        RETURN;
    END

    IF @TipoPago NOT IN ('Adelanto', 'Abono', 'Saldo Total')
    BEGIN
        RAISERROR('Tipo de pago inválido. Use: Adelanto, Abono o Saldo Total.', 16, 1);
        RETURN;
    END

    SELECT @PedidoId = PedidoId, @MontoActual = Monto FROM Pagos WHERE PagoId = @PagoId;

    SELECT @MontoTotal  = MontoTotal FROM Pedidos WHERE PedidoId = @PedidoId;
    SELECT @TotalPagado = ISNULL(SUM(Monto), 0) FROM Pagos WHERE PedidoId = @PedidoId AND PagoId <> @PagoId;

    SET @SaldoDisponible = @MontoTotal - @TotalPagado;

    IF @Monto > @SaldoDisponible
    BEGIN
        DECLARE @MsgError NVARCHAR(300);
        SET @MsgError = 'El monto (' + CAST(@Monto AS NVARCHAR(20)) +
                        ') supera el saldo disponible (' + CAST(@SaldoDisponible AS NVARCHAR(20)) + ').';
        RAISERROR(@MsgError, 16, 1);
        RETURN;
    END

    UPDATE Pagos
    SET Monto    = @Monto,
        TipoPago = @TipoPago,
        Notas    = @Notas
    WHERE PagoId = @PagoId;

    SELECT @PagoId;
END
