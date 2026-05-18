-- =====================================================================
-- SP 4: sp_ActualizarProducto
-- Actualiza los datos de un producto existente.
-- =====================================================================
CREATE PROCEDURE sp_ActualizarProducto
    @ProductoId     INT,
    @Nombre         NVARCHAR(100),
    @Categoria      NVARCHAR(50),
    @UnidadMedida   NVARCHAR(20),
    @StockMinimo    DECIMAL(10,2),
    @PrecioUnitario DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM ProductosInventario WHERE ProductoId = @ProductoId AND Activo = 1)
    BEGIN
        RAISERROR('El producto no existe o está inactivo.', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM ProductosInventario WHERE Nombre = @Nombre AND ProductoId <> @ProductoId AND Activo = 1)
    BEGIN
        RAISERROR('Ya existe otro producto activo con ese nombre.', 16, 1);
        RETURN;
    END

    IF @PrecioUnitario <= 0
    BEGIN
        RAISERROR('El precio unitario debe ser mayor a cero.', 16, 1);
        RETURN;
    END

    UPDATE ProductosInventario
    SET
        Nombre         = @Nombre,
        Categoria      = @Categoria,
        UnidadMedida   = @UnidadMedida,
        StockMinimo    = @StockMinimo,
        PrecioUnitario = @PrecioUnitario
    WHERE ProductoId = @ProductoId;

    SELECT @ProductoId;
END
