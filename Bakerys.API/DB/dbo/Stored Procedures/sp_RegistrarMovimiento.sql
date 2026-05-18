-- =====================================================================
-- SP 6: sp_RegistrarMovimiento
-- Registra una entrada o salida de inventario.
-- Actualiza StockActual del producto automáticamente.
-- Valida stock suficiente en caso de Salida.
-- =====================================================================
CREATE PROCEDURE sp_RegistrarMovimiento
    @ProductoId     INT,
    @TipoMovimiento NVARCHAR(10),   -- Entrada | Salida
    @Cantidad       DECIMAL(10,2),
    @Notas          NVARCHAR(300) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar que el producto exista y esté activo
    IF NOT EXISTS (SELECT 1 FROM ProductosInventario WHERE ProductoId = @ProductoId AND Activo = 1)
    BEGIN
        RAISERROR('El producto no existe o está inactivo.', 16, 1);
        RETURN;
    END

    -- Validar tipo de movimiento
    IF @TipoMovimiento NOT IN ('Entrada', 'Salida')
    BEGIN
        RAISERROR('Tipo de movimiento inválido. Use: Entrada o Salida.', 16, 1);
        RETURN;
    END

    -- Validar cantidad
    IF @Cantidad <= 0
    BEGIN
        RAISERROR('La cantidad debe ser mayor a cero.', 16, 1);
        RETURN;
    END

    -- Validar stock suficiente en caso de Salida
    IF @TipoMovimiento = 'Salida'
    BEGIN
        DECLARE @StockActual DECIMAL(10,2);
        SELECT @StockActual = StockActual FROM ProductosInventario WHERE ProductoId = @ProductoId;

        IF @Cantidad > @StockActual
        BEGIN
            DECLARE @MsgError NVARCHAR(300);
            SET @MsgError = 'Stock insuficiente. Stock actual: ' + CAST(@StockActual AS NVARCHAR(20)) +
                            ', cantidad solicitada: ' + CAST(@Cantidad AS NVARCHAR(20)) + '.';
            RAISERROR(@MsgError, 16, 1);
            RETURN;
        END
    END

    -- Actualizar stock
    UPDATE ProductosInventario
    SET StockActual = CASE
                        WHEN @TipoMovimiento = 'Entrada' THEN StockActual + @Cantidad
                        WHEN @TipoMovimiento = 'Salida'  THEN StockActual - @Cantidad
                      END
    WHERE ProductoId = @ProductoId;

    -- Registrar movimiento
    INSERT INTO MovimientosInventario (ProductoId, TipoMovimiento, Cantidad, Notas)
    VALUES (@ProductoId, @TipoMovimiento, @Cantidad, @Notas);

    SELECT CAST(SCOPE_IDENTITY() AS INT);
END
