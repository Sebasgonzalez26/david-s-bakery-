using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagoController : ControllerBase
    {
        private IPagoFlujo _pagoFlujo;
        private ILogger<PagoController> _logger;

        public PagoController(IPagoFlujo pagoFlujo, ILogger<PagoController> logger)
        {
            _pagoFlujo = pagoFlujo;
            _logger = logger;
        }

        public Task<IActionResult> Agregar(PagoRequest pago)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> ObtenerPorPedido(int pedidoId)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> ObtenerSaldoPendiente(int pedidoId)
        {
            throw new NotImplementedException();
        }
    }
}
