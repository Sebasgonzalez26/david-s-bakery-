using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class LoginRequest
    {
        [Required][EmailAddress] public string CorreoElectronico { get; set; } = string.Empty;
        [Required] public string PasswordHash { get; set; } = string.Empty;
    }
}
