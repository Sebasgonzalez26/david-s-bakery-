

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
            throw new NotImplementedException();
        }

        public Task<int> Agregar(PedidoRequest pedido)
        {
            throw new NotImplementedException();
        }

        public Task<int> AgregarDetalle(DetallePedidoRequest detalle)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<PedidoResponse>> Buscar(string? busqueda, int? estadoId, DateOnly? fechaDesde, DateOnly? fechaHasta)
        {
            throw new NotImplementedException();
        }

        public Task<int> Cancelar(int id, string? motivo)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<PedidoResponse>> Obtener()
        {
            throw new NotImplementedException();
        }

        public Task<PedidoResponse> Obtener(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<EstadoPedidoResponse>> ObtenerEstados()
        {
            throw new NotImplementedException();
        }
    }
}
