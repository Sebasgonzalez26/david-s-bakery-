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
