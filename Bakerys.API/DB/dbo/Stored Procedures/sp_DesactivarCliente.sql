
-- =====================================================================
-- SP 5: sp_DesactivarCliente
-- Baja lógica: no borra el registro, solo lo marca como inactivo.
-- No permite desactivar si tiene pedidos activos sin entregar.
-- =====================================================================
CREATE   PROCEDURE sp_DesactivarCliente
    @ClienteId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar que el cliente exista
    IF NOT EXISTS (SELECT 1 FROM Clientes WHERE ClienteId = @ClienteId AND Activo = 1)
    BEGIN
        RAISERROR('Cliente no encontrado o ya inactivo.', 16, 1);
        RETURN;
    END

    -- No desactivar si tiene pedidos pendientes o en proceso
    IF EXISTS (
        SELECT 1
        FROM Pedidos p
            INNER JOIN EstadosPedido e ON e.EstadoId = p.EstadoId
        WHERE p.ClienteId = @ClienteId
          AND e.Nombre NOT IN ('Entregado', 'Cancelado')
    )
    BEGIN
        RAISERROR('No se puede desactivar: el cliente tiene pedidos activos.', 16, 1);
        RETURN;
    END

    UPDATE Clientes
    SET Activo = 0
    WHERE ClienteId = @ClienteId;

    SELECT @ClienteId;
END