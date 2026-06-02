using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA;

public interface IPagoDA
{
    Task<IEnumerable<PagoResponse>> ObtenerTodos();
    Task<IEnumerable<PagoResponse>> ObtenerPorPedido(int pedidoId);
    Task<decimal>                   ObtenerSaldoPendiente(int pedidoId);
    Task<int>                       Agregar(PagoRequest pago);
}
