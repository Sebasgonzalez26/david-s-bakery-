using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteController : ControllerBase, IClienteController

    {

        private IClienteFlujo _clienteFlujo;
        private ILogger<ClienteController> _logger;

        public ClienteController(IClienteFlujo clienteFlujo, ILogger<ClienteController> logger)
        {
            _clienteFlujo = clienteFlujo;
            _logger = logger;
        }

        public Task<IActionResult> Agregar(ClienteRequest cliente)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> Buscar(string busqueda)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> Desactivar(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> Editar(int id, ClienteRequest cliente)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> Obtener()
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> Obtener(int id)
        {
            throw new NotImplementedException();
        }
    }
}
