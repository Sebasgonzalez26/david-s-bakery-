using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Dapper;
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

        public async Task<int> Agregar(PagoRequest pago)
        {
            string query = "sp_RegistrarPago";
            var resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                PedidoId       = pago.PedidoId,
                Monto          = pago.Monto,
                TipoPago       = pago.TipoPago,
                ComprobanteUrl = pago.ComprobanteUrl,
                Notas          = pago.Notas
            });
            return resultado;
        }

        public async Task<IEnumerable<PagoResponse>> ObtenerPorPedido(int pedidoId)
        {
            string query = "sp_ObtenerPagosPorPedido";

            // El SP devuelve 2 result sets — solo necesitamos el primero (los pagos)
            using var multi = await _sqlconexion.QueryMultipleAsync(query, new { PedidoId = pedidoId });
            var pagos = await multi.ReadAsync<PagoResponse>();
            return pagos;
        }

        public async Task<decimal> ObtenerSaldoPendiente(int pedidoId)
        {
            string query = "sp_ObtenerSaldoPendiente";
            var resultado = await _sqlconexion.ExecuteScalarAsync<decimal>(query, new
            {
                PedidoId = pedidoId
            });
            return resultado;
        }
    }
}
