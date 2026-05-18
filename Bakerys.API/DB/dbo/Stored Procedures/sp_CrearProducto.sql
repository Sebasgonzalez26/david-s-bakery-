-- =====================================================================
-- SP 3: sp_CrearProducto
-- Registra un nuevo producto en el inventario.
-- Valida que no exista otro con el mismo nombre.
-- =====================================================================
CREATE PROCEDURE sp_CrearProducto
    @Nombre         NVARCHAR(100),
    @Categoria      NVARCHAR(50),
    @UnidadMedida   NVARCHAR(20),
    @StockActual    DECIMAL(10,2) = 0,
    @StockMinimo    DECIMAL(10,2) = 0,
    @PrecioUnitario DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM ProductosInventario WHERE Nombre = @Nombre AND Activo = 1)
    BEGIN
        RAISERROR('Ya existe un producto activo con ese nombre.', 16, 1);
        RETURN;
    END

    IF @PrecioUnitario <= 0
    BEGIN
        RAISERROR('El precio unitario debe ser mayor a cero.', 16, 1);
        RETURN;
    END

    INSERT INTO ProductosInventario (Nombre, Categoria, UnidadMedida, StockActual, StockMinimo, PrecioUnitario)
    VALUES (@Nombre, @Categoria, @UnidadMedida, @StockActual, @StockMinimo, @PrecioUnitario);

    SELECT CAST(SCOPE_IDENTITY() AS INT);
END
