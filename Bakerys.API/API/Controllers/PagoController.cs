using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagoController : ControllerBase, IPagoController
    {
        private IPagoFlujo _pagoFlujo;
        private ILogger<PagoController> _logger;

        public PagoController(IPagoFlujo pagoFlujo, ILogger<PagoController> logger)
        {
            _pagoFlujo = pagoFlujo;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Agregar(PagoRequest pago)
        {
            var resultado = await _pagoFlujo.Agregar(pago);
            return Ok(resultado);
        }

        [HttpGet("pedido/{pedidoId}")]
        public async Task<IActionResult> ObtenerPorPedido(int pedidoId)
        {
            var resultado = await _pagoFlujo.ObtenerPorPedido(pedidoId);
            return Ok(resultado);
        }

        [HttpGet("pedido/{pedidoId}/saldo")]
        public async Task<IActionResult> ObtenerSaldoPendiente(int pedidoId)
        {
            var resultado = await _pagoFlujo.ObtenerSaldoPendiente(pedidoId);
            return Ok(resultado);
        }
    }
}
