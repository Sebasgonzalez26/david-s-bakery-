using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
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

        public Task<IActionResult> ActualizarEstado(int id, int estadoId)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> Agregar(PedidoRequest pedido)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> AgregarDetalle(DetallePedidoRequest detalle)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> Buscar(string? busqueda, int? estadoId, DateOnly? fechaDesde, DateOnly? fechaHasta)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> Cancelar(int id, string? motivo)
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

        public Task<IActionResult> ObtenerEstados()
        {
            throw new NotImplementedException();
        }
    }
}
