using Abstracciones.Interfaces;
using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;

namespace Flujo
{
    public class RecuperacionFlujo : IRecuperacionFlujo
    {
        private readonly IRecuperacionDA _recuperacionDA;
        private readonly IEmailService   _emailService;
        private readonly IConfiguration  _configuration;

        public RecuperacionFlujo(IRecuperacionDA recuperacionDA, IEmailService emailService, IConfiguration configuration)
        {
            _recuperacionDA = recuperacionDA;
            _emailService   = emailService;
            _configuration  = configuration;
        }

        public async Task SolicitarRecuperacion(string correo)
        {
            var token = await _recuperacionDA.CrearToken(correo);
            if (token == null) return; // Correo no existe, no revelamos nada

            var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
            var link        = $"{frontendUrl}/restablecer-contrasena?token={token}";

            var cuerpo = $@"
                <div style='font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;'>
                    <div style='margin-bottom:24px;'>
                        <span style='display:inline-flex;align-items:center;justify-content:center;
                            width:42px;height:42px;border-radius:12px;background:#1e1008;
                            font-size:20px;color:#fff;font-family:Georgia,serif;'>D</span>
                    </div>
                    <h2 style='color:#1e1008;margin-bottom:8px;'>Restablecer contraseña</h2>
                    <p style='color:#666;line-height:1.6;'>
                        Recibiste este correo porque solicitaste restablecer tu contraseña en
                        <strong>Davi's Bakery</strong>.
                    </p>
                    <a href='{link}' style='display:inline-block;margin:28px 0;padding:13px 32px;
                        background:linear-gradient(135deg,#3d1f08,#1e1008);color:#fff;
                        border-radius:100px;text-decoration:none;font-weight:600;font-size:14px;'>
                        Restablecer contraseña →
                    </a>
                    <p style='color:#999;font-size:12px;line-height:1.6;'>
                        Este enlace expira en <strong>1 hora</strong>.<br/>
                        Si no solicitaste esto, podés ignorar este correo.
                    </p>
                </div>";

            await _emailService.EnviarAsync(correo, "Restablecer contraseña — Davi's Bakery", cuerpo);
        }

        public async Task<bool> ValidarToken(string token)
            => await _recuperacionDA.ValidarToken(token);

        public async Task RestablecerPassword(string token, string passwordHash)
            => await _recuperacionDA.ActualizarPassword(token, passwordHash);
    }
}
