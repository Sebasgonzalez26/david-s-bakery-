using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class PagoFlujo : IPagoFlujo
    {
        private IPagoDA _pagoDA;

        public PagoFlujo(IPagoDA pagoDA)
        {
            _pagoDA = pagoDA;
        }

        public Task<int> Agregar(PagoRequest pago)
        {
            return _pagoDA.Agregar(pago);
        }

        public Task<IEnumerable<PagoResponse>> ObtenerPorPedido(int pedidoId)
        {
            return _pagoDA.ObtenerPorPedido(pedidoId);
        }

        public Task<decimal> ObtenerSaldoPendiente(int pedidoId)
        {
            return _pagoDA.ObtenerSaldoPendiente(pedidoId);
        }
    }
}
