using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA;

public interface IMovimientoInventarioDA
{
    Task<IEnumerable<MovimientoInventarioResponse>> ObtenerTodos();
    Task<IEnumerable<MovimientoInventarioResponse>> ObtenerPorProducto(int productoId);
    Task<int>                                       Registrar(MovimientoInventarioRequest movimiento);
}
