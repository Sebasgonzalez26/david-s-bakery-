using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API;

public interface IPagoController
{
    Task<IActionResult> Agregar(PagoRequest pago);
    Task<IActionResult> ObtenerPorPedido(int pedidoId);
    Task<IActionResult> ObtenerSaldoPendiente(int pedidoId);
}
