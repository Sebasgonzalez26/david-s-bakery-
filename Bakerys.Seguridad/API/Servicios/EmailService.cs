using Abstracciones.Interfaces;
using System.Net;
using System.Net.Mail;

namespace Servicios
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task EnviarAsync(string destinatario, string asunto, string cuerpoHtml)
        {
            var host       = _configuration["Email:SmtpHost"]!;
            var port       = int.Parse(_configuration["Email:SmtpPort"]!);
            var remitente  = _configuration["Email:Remitente"]!;
            var password   = _configuration["Email:AppPassword"]!;

            using var cliente = new SmtpClient(host, port)
            {
                EnableSsl   = true,
                Credentials = new NetworkCredential(remitente, password),
            };

            var mensaje = new MailMessage(remitente, destinatario, asunto, cuerpoHtml)
            {
                IsBodyHtml = true,
            };

            await cliente.SendMailAsync(mensaje);
        }
    }
}
