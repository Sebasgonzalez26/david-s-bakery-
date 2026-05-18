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

        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var resultado = await _clienteFlujo.Obtener();
            if (!resultado.Any())
            {
                return NoContent();
            }
            return Ok(resultado);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtener(int id)
        {
            var resultado = await _clienteFlujo.Obtener(id);
            return Ok(resultado);
        }

        [HttpGet("buscar")]
        public async Task<IActionResult> Buscar(string busqueda)
        {
            var resultado = await _clienteFlujo.Buscar(busqueda);
            return Ok(resultado);
        }

        [HttpPost]
        public async Task<IActionResult> Agregar(ClienteRequest cliente)
        {
            var resultado = await _clienteFlujo.Agregar(cliente);
            return Ok(resultado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Editar(int id, ClienteRequest cliente)
        {
            var resultado = await _clienteFlujo.Editar(id, cliente);
            return Ok(resultado);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Desactivar(int id)
        {
            var resultado = await _clienteFlujo.Desactivar(id);
            return Ok(resultado);
        }
    }
}
