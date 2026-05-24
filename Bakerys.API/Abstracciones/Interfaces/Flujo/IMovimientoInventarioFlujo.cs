using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo;

public interface IMovimientoInventarioFlujo
{
    Task<IEnumerable<MovimientoInventarioResponse>> ObtenerPorProducto(int productoId);
    Task<int>                                       Registrar(MovimientoInventarioRequest movimiento);
}
