using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase, IUsuarioController
    {
        private readonly IUsuarioFlujo _usuarioFlujo;

        public UsuarioController(IUsuarioFlujo usuarioFlujo)
        {
            _usuarioFlujo = usuarioFlujo;
        }

        [AllowAnonymous]
        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] RegistroRequest registro)
        {
            try
            {
                var id = await _usuarioFlujo.CrearUsuario(registro);
                return Ok(new { id, mensaje = "Usuario registrado correctamente." });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { mensaje = "Código de registro inválido." });
            }
        }
    }
}
