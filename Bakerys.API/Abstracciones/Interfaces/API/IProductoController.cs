using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API;

public interface IProductoController
{
    Task<IActionResult> Obtener(string? categoria, bool soloActivos, bool soloStockBajo);
    Task<IActionResult> Obtener(int id);
    Task<IActionResult> Agregar(ProductoRequest producto);
    Task<IActionResult> Editar(int id, ProductoRequest producto);
    Task<IActionResult> Desactivar(int id);
}
