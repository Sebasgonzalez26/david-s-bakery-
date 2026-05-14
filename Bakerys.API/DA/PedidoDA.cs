

using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Microsoft.Data.SqlClient;

namespace DA
{
    public class PedidoDA : IPedidoDA
    {

        private IRepositorioDapper _repositorioDapper;

        private SqlConnection _sqlconexion;

        public PedidoDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlconexion = (SqlConnection)_repositorioDapper.ObtenerRepositorio();
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
