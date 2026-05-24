using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovimientoInventarioController : ControllerBase, IMovimientoInventarioController
    {
        private IMovimientoInventarioFlujo            _movimientoFlujo;
        private ILogger<MovimientoInventarioController> _logger;

        public MovimientoInventarioController(IMovimientoInventarioFlujo movimientoFlujo, ILogger<MovimientoInventarioController> logger)
        {
            _movimientoFlujo = movimientoFlujo;
            _logger          = logger;
        }

        [HttpGet("producto/{productoId}")]
        public async Task<IActionResult> ObtenerPorProducto(int productoId)
        {
            var resultado = await _movimientoFlujo.ObtenerPorProducto(productoId);
            return Ok(resultado);
        }

        [HttpPost]
        public async Task<IActionResult> Registrar(MovimientoInventarioRequest movimiento)
        {
            var resultado = await _movimientoFlujo.Registrar(movimiento);
            return CreatedAtAction(nameof(ObtenerPorProducto), new { productoId = movimiento.ProductoId }, resultado);
        }
    }
}
