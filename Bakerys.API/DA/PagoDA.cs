using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Dapper;
using System.Data;

namespace DA
{
    public class PagoDA : IPagoDA
    {
        private readonly IDbConnection _sqlconexion;

        public PagoDA(IRepositorioDapper repositorioDapper)
        {
            _sqlconexion = repositorioDapper.ObtenerRepositorio();
        }

        public async Task<int> Agregar(PagoRequest pago)
        {
            var resultado = await _sqlconexion.ExecuteScalarAsync<int>("sp_RegistrarPago", new
            {
                PedidoId       = pago.PedidoId,
                Monto          = pago.Monto,
                TipoPago       = pago.TipoPago,
                ComprobanteUrl = pago.ComprobanteUrl,
                Notas          = pago.Notas
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }

        public async Task<IEnumerable<PagoResponse>> ObtenerTodos()
        {
            return await _sqlconexion.QueryAsync<PagoResponse>("sp_ObtenerPagos",
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<PagoResponse>> ObtenerPorPedido(int pedidoId)
        {
            return await _sqlconexion.QueryAsync<PagoResponse>("sp_ObtenerPagosPorPedido",
                new { PedidoId = pedidoId },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<decimal> ObtenerSaldoPendiente(int pedidoId)
        {
            return await _sqlconexion.ExecuteScalarAsync<decimal>("sp_ObtenerSaldoPendiente",
                new { PedidoId = pedidoId },
                commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}
