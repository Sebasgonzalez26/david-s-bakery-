

using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class PedidoFlujo : IPedidoFlujo
    {

        private IPedidoDA _pedidoDA;

        public PedidoFlujo(IPedidoDA pedidoDA)
        {
            _pedidoDA = pedidoDA;
        }

        public Task<int> ActualizarEstado(int id, int estadoId)
        {
            return _pedidoDA.ActualizarEstado(id, estadoId);
        }

        public Task<int> Agregar(PedidoRequest pedido)
        {
            return _pedidoDA.Agregar(pedido);
        }

        public Task<int> AgregarDetalle(DetallePedidoRequest detalle)
        {
            return _pedidoDA.AgregarDetalle(detalle);
        }

        public Task<IEnumerable<PedidoResponse>> Buscar(string? busqueda, int? estadoId, DateTime? fechaDesde, DateTime? fechaHasta)
        {
            return _pedidoDA.Buscar(busqueda, estadoId, fechaDesde, fechaHasta);
        }

        public Task<int> Cancelar(int id, string? motivo)
        {
            return _pedidoDA.Cancelar(id, motivo);
        }

        public Task<IEnumerable<PedidoResponse>> Obtener()
        {
            return _pedidoDA.Obtener();
        }

        public Task<PedidoResponse?> Obtener(int id)
        {
            return _pedidoDA.Obtener(id);
        }

        public Task<IEnumerable<EstadoPedidoResponse>> ObtenerEstados()
        {
            return _pedidoDA.ObtenerEstados();
        }
    }
}
