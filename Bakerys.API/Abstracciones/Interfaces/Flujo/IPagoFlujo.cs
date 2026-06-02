using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IPagoFlujo
    {
        Task<IEnumerable<PagoResponse>> ObtenerTodos();
        Task<IEnumerable<PagoResponse>> ObtenerPorPedido(int pedidoId);
        Task<decimal> ObtenerSaldoPendiente(int pedidoId);
        Task<int> Agregar(PagoRequest pago);
    }
}
