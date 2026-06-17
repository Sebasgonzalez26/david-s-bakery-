

using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IClienteController
    {
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(int id);
        Task<IActionResult> Buscar(string busqueda);
        Task<IActionResult> Agregar(ClienteRequest cliente);
        Task<IActionResult> Editar(int id, ClienteRequest cliente);
        Task<IActionResult> Desactivar(int id);
        Task<IActionResult> Activar(int id);
    }
}
