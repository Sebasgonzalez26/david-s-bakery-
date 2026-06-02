using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransaccionController : ControllerBase, ITransaccionController
    {
        private ITransaccionFlujo            _transaccionFlujo;
        private ILogger<TransaccionController> _logger;

        public TransaccionController(ITransaccionFlujo transaccionFlujo, ILogger<TransaccionController> logger)
        {
            _transaccionFlujo = transaccionFlujo;
            _logger           = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Obtener(string? tipo, string? categoria, DateTime? fechaDesde, DateTime? fechaHasta)
        {
            var resultado = await _transaccionFlujo.Obtener(tipo, categoria, fechaDesde, fechaHasta);
            return Ok(resultado);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtener(int id)
        {
            var resultado = await _transaccionFlujo.Obtener(id);
            return Ok(resultado);
        }

        [HttpPost]
        public async Task<IActionResult> Registrar(TransaccionRequest transaccion)
        {
            var resultado = await _transaccionFlujo.Registrar(transaccion);
            return CreatedAtAction(nameof(Obtener), new { id = resultado }, resultado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Editar(int id, TransaccionRequest transaccion)
        {
            var resultado = await _transaccionFlujo.Editar(id, transaccion);
            return Ok(resultado);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var resultado = await _transaccionFlujo.Eliminar(id);
            return Ok(resultado);
        }

        [HttpGet("resumen")]
        public async Task<IActionResult> ObtenerResumen(int? mes, int? anio)
        {
            var now    = DateTime.Now;
            int m      = mes  ?? now.Month;
            int a      = anio ?? now.Year;
            var desde  = new DateTime(a, m, 1);
            var hasta  = desde.AddMonths(1).AddDays(-1);
            var resultado = await _transaccionFlujo.ObtenerResumen(desde, hasta);
            return Ok(resultado);
        }
    }
}
