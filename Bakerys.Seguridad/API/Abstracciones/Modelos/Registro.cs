using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class RegistroRequest
    {
        [Required] public string NombreUsuario     { get; set; } = string.Empty;
        [Required][EmailAddress] public string CorreoElectronico { get; set; } = string.Empty;
        [Required] public string PasswordHash      { get; set; } = string.Empty;
        [Required] public string CodigoRegistro   { get; set; } = string.Empty;
    }
}
