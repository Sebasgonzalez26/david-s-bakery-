using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class UsuarioBase
    {
        [Required] public string NombreUsuario     { get; set; } = string.Empty;
        [Required] public string PasswordHash      { get; set; } = string.Empty;
        [Required][EmailAddress] public string CorreoElectronico { get; set; } = string.Empty;
    }

    public class Usuario : UsuarioBase
    {
        public Guid Id     { get; set; }
        public bool Activo { get; set; }
    }
}
