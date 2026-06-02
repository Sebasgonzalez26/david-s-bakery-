using Abstracciones.Modelos;

public interface IPedidoDA
{
    // Pedidos
    Task<IEnumerable<PedidoResponse>> Obtener();
    Task<PedidoResponse?> Obtener(int id);
    Task<IEnumerable<PedidoResponse>> Buscar(string? busqueda, int? estadoId, DateTime? fechaDesde, DateTime? fechaHasta);
    Task<int> Agregar(PedidoRequest pedido);
    Task<int> Editar(int id, PedidoUpdateRequest pedido);
    Task<int> ActualizarEstado(int id, int estadoId);
    Task<int> Cancelar(int id, string? motivo);

    // Detalles — siempre dentro del contexto del pedido
    Task<int> AgregarDetalle(DetallePedidoRequest detalle);

    // Estados — catálogo para llenar dropdowns
    Task<IEnumerable<EstadoPedidoResponse>> ObtenerEstados();
}