using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class SolicitarRecuperacionRequest
    {
        [Required][EmailAddress] public string CorreoElectronico { get; set; } = string.Empty;
    }

    public class RestablecerPasswordRequest
    {
        [Required] public string Token        { get; set; } = string.Empty;
        [Required] public string PasswordHash { get; set; } = string.Empty;
    }
}
