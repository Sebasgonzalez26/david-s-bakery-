-- =====================================================================
-- SP 5: sp_DesactivarProducto
-- Desactiva un producto (soft delete).
-- =====================================================================
CREATE PROCEDURE sp_DesactivarProducto
    @ProductoId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM ProductosInventario WHERE ProductoId = @ProductoId AND Activo = 1)
    BEGIN
        RAISERROR('El producto no existe o ya está inactivo.', 16, 1);
        RETURN;
    END

    UPDATE ProductosInventario
    SET Activo = 0
    WHERE ProductoId = @ProductoId;

    SELECT @ProductoId;
END
