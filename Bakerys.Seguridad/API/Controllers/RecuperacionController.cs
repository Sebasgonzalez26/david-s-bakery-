using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class RecuperacionController : ControllerBase
    {
        private readonly IRecuperacionFlujo _recuperacionFlujo;

        public RecuperacionController(IRecuperacionFlujo recuperacionFlujo)
        {
            _recuperacionFlujo = recuperacionFlujo;
        }

        [HttpPost("solicitar")]
        public async Task<IActionResult> Solicitar([FromBody] SolicitarRecuperacionRequest request)
        {
            try
            {
                await _recuperacionFlujo.SolicitarRecuperacion(request.CorreoElectronico);
            }
            catch { /* No revelar errores de envío */ }

            // Siempre OK para no revelar si el correo existe
            return Ok(new { mensaje = "Si el correo está registrado, recibirás un enlace de recuperación." });
        }

        [HttpGet("validar")]
        public async Task<IActionResult> Validar([FromQuery] string token)
        {
            var valido = await _recuperacionFlujo.ValidarToken(token);
            return valido ? Ok() : BadRequest(new { mensaje = "El enlace es inválido o ya expiró." });
        }

        [HttpPost("restablecer")]
        public async Task<IActionResult> Restablecer([FromBody] RestablecerPasswordRequest request)
        {
            try
            {
                var valido = await _recuperacionFlujo.ValidarToken(request.Token);
                if (!valido)
                    return BadRequest(new { mensaje = "El enlace es inválido o ya expiró." });

                await _recuperacionFlujo.RestablecerPassword(request.Token, request.PasswordHash);
                return Ok(new { mensaje = "Contraseña actualizada correctamente." });
            }
            catch
            {
                return BadRequest(new { mensaje = "No se pudo actualizar la contraseña." });
            }
        }
    }
}
