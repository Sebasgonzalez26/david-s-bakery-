using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class MovimientoInventarioFlujo : IMovimientoInventarioFlujo
    {
        private IMovimientoInventarioDA _movimientoDA;

        public MovimientoInventarioFlujo(IMovimientoInventarioDA movimientoDA)
        {
            _movimientoDA = movimientoDA;
        }

        public Task<IEnumerable<MovimientoInventarioResponse>> ObtenerTodos()
        {
            return _movimientoDA.ObtenerTodos();
        }

        public Task<IEnumerable<MovimientoInventarioResponse>> ObtenerPorProducto(int productoId)
        {
            return _movimientoDA.ObtenerPorProducto(productoId);
        }

        public Task<int> Registrar(MovimientoInventarioRequest movimiento)
        {
            return _movimientoDA.Registrar(movimiento);
        }
    }
}
