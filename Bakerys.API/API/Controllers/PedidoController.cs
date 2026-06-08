using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class PedidoController : ControllerBase, IPedidoController
    {
        private IPedidoFlujo _pedidoFlujo;
        private ILogger<PedidoController> _logger;

        public PedidoController(IPedidoFlujo pedidoFlujo, ILogger<PedidoController> logger)
        {
            _pedidoFlujo = pedidoFlujo;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var resultado = await _pedidoFlujo.Obtener();
            return Ok(resultado);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtener(int id)
        {
            var resultado = await _pedidoFlujo.Obtener(id);
            return Ok(resultado);
        }

        [HttpGet("buscar")]
        public async Task<IActionResult> Buscar(string? busqueda, int? estadoId, DateTime? fechaDesde, DateTime? fechaHasta)
        {
            var resultado = await _pedidoFlujo.Buscar(busqueda, estadoId, fechaDesde, fechaHasta);
            return Ok(resultado);
        }

        [HttpPost]
        public async Task<IActionResult> Agregar(PedidoRequest pedido)
        {
            var resultado = await _pedidoFlujo.Agregar(pedido);
            return CreatedAtAction(nameof(Obtener), new { id = resultado }, resultado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Editar(int id, PedidoUpdateRequest pedido)
        {
            var resultado = await _pedidoFlujo.Editar(id, pedido);
            return Ok(resultado);
        }

        [HttpPut("{id}/estado")]
        public async Task<IActionResult> ActualizarEstado(int id, int estadoId)
        {
            var resultado = await _pedidoFlujo.ActualizarEstado(id, estadoId);
            return Ok(resultado);
        }

        [HttpPut("{id}/cancelar")]
        public async Task<IActionResult> Cancelar(int id, string? motivo)
        {
            var resultado = await _pedidoFlujo.Cancelar(id, motivo);
            return Ok(resultado);
        }

        [HttpPost("detalle")]
        public async Task<IActionResult> AgregarDetalle(DetallePedidoRequest detalle)
        {
            var resultado = await _pedidoFlujo.AgregarDetalle(detalle);
            return CreatedAtAction(nameof(Obtener), new { id = detalle.PedidoId }, resultado);
        }

        [HttpGet("estados")]
        public async Task<IActionResult> ObtenerEstados()
        {
            var resultado = await _pedidoFlujo.ObtenerEstados();
            return Ok(resultado);
        }
    }
}
