using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API;

public interface IMovimientoInventarioController
{
    Task<IActionResult> ObtenerPorProducto(int productoId);
    Task<IActionResult> Registrar(MovimientoInventarioRequest movimiento);
}
