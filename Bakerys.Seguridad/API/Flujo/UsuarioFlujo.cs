using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.Extensions.Configuration;

namespace Flujo
{
    public class UsuarioFlujo : IUsuarioFlujo
    {
        private readonly IUsuarioDA     _usuarioDA;
        private readonly IConfiguration _configuration;

        public UsuarioFlujo(IUsuarioDA usuarioDA, IConfiguration configuration)
        {
            _usuarioDA      = usuarioDA;
            _configuration  = configuration;
        }

        public async Task<Guid> CrearUsuario(RegistroRequest registro)
        {
            var codigoValido = _configuration["CodigoRegistro"];
            if (registro.CodigoRegistro != codigoValido)
                throw new UnauthorizedAccessException("Código de registro inválido.");

            return await _usuarioDA.CrearUsuario(new UsuarioBase
            {
                NombreUsuario     = registro.NombreUsuario,
                CorreoElectronico = registro.CorreoElectronico,
                PasswordHash      = registro.PasswordHash
            });
        }
    }
}
