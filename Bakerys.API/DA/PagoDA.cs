using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Microsoft.Data.SqlClient;

namespace DA
{
    public class PagoDA : IPagoDA
    {
        private IRepositorioDapper _repositorioDapper;
        private SqlConnection _sqlconexion;

        public PagoDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlconexion = (SqlConnection)_repositorioDapper.ObtenerRepositorio();
        }

        public Task<int> Agregar(PagoRequest pago)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<PagoResponse>> ObtenerPorPedido(int pedidoId)
        {
            throw new NotImplementedException();
        }

        public Task<decimal> ObtenerSaldoPendiente(int pedidoId)
        {
            throw new NotImplementedException();
        }
    }
}
