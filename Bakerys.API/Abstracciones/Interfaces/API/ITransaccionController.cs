using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API;

public interface ITransaccionController
{
    Task<IActionResult> Obtener(string? tipo, string? categoria, DateTime? fechaDesde, DateTime? fechaHasta);
    Task<IActionResult> Obtener(int id);
    Task<IActionResult> Registrar(TransaccionRequest transaccion);
    Task<IActionResult> Editar(int id, TransaccionRequest transaccion);
    Task<IActionResult> Eliminar(int id);
    Task<IActionResult> ObtenerResumen(DateTime? fechaDesde, DateTime? fechaHasta);
}
