using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase, IProductoController
    {
        private IProductoFlujo            _productoFlujo;
        private ILogger<ProductoController> _logger;

        public ProductoController(IProductoFlujo productoFlujo, ILogger<ProductoController> logger)
        {
            _productoFlujo = productoFlujo;
            _logger        = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Obtener(string? categoria, bool soloActivos = true, bool soloStockBajo = false)
        {
            var resultado = await _productoFlujo.Obtener(categoria, soloActivos, soloStockBajo);
            return Ok(resultado);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtener(int id)
        {
            var resultado = await _productoFlujo.Obtener(id);
            return Ok(resultado);
        }

        [HttpPost]
        public async Task<IActionResult> Agregar(ProductoRequest producto)
        {
            var resultado = await _productoFlujo.Agregar(producto);
            return CreatedAtAction(nameof(Obtener), new { id = resultado }, resultado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Editar(int id, ProductoRequest producto)
        {
            var resultado = await _productoFlujo.Editar(id, producto);
            return Ok(resultado);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Desactivar(int id)
        {
            var resultado = await _productoFlujo.Desactivar(id);
            return Ok(resultado);
        }
    }
}
