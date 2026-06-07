using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Flujo
{
    public class AutenticacionFlujo : IAutenticacionFlujo
    {
        private readonly IUsuarioDA      _usuarioDA;
        private readonly IConfiguration  _configuration;

        public AutenticacionFlujo(IUsuarioDA usuarioDA, IConfiguration configuration)
        {
            _usuarioDA     = usuarioDA;
            _configuration = configuration;
        }

        public async Task<Token> LoginAsync(LoginRequest login)
        {
            var respuesta = new Token { ValidacionExitosa = false, AccessToken = string.Empty };

            var usuario = await _usuarioDA.ObtenerUsuario(new UsuarioBase
            {
                NombreUsuario     = login.NombreUsuario,
                CorreoElectronico = login.CorreoElectronico,
                PasswordHash      = login.PasswordHash
            });

            if (usuario == null)                              return respuesta;
            if (usuario.PasswordHash != login.PasswordHash)  return respuesta;

            var tokenConfig = _configuration.GetSection("Token").Get<TokenConfiguracion>()!;
            var token       = GenerarToken(usuario, tokenConfig);

            respuesta.AccessToken       = new JwtSecurityTokenHandler().WriteToken(token);
            respuesta.ValidacionExitosa = true;
            return respuesta;
        }

        private JwtSecurityToken GenerarToken(Usuario usuario, TokenConfiguracion config)
        {
            var key         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name,           usuario.NombreUsuario),
                new Claim(ClaimTypes.Email,          usuario.CorreoElectronico),
            };

            return new JwtSecurityToken(
                issuer:            config.Issuer,
                audience:          config.Audience,
                claims:            claims,
                expires:           DateTime.UtcNow.AddMinutes(config.Expires),
                signingCredentials: credentials);
        }
    }
}
