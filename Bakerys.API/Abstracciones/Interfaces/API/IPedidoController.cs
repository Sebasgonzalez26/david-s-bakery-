using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API;

public interface IPedidoController
{
    Task<IActionResult> Obtener();
    Task<IActionResult> Obtener(int id);
    Task<IActionResult> Buscar(string? busqueda, int? estadoId, DateTime? fechaDesde, DateTime? fechaHasta);
    Task<IActionResult> Agregar(PedidoRequest pedido);
    Task<IActionResult> ActualizarEstado(int id, int estadoId);
    Task<IActionResult> Cancelar(int id, string? motivo);
    Task<IActionResult> AgregarDetalle(DetallePedidoRequest detalle);
    Task<IActionResult> ObtenerEstados();
}
