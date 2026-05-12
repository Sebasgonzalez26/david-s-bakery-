using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos;

public class ClienteBase
{
    [Required(ErrorMessage = "El nombre es requerido")]
    [StringLength(100, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres", MinimumLength = 2)]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El teléfono es requerido")]
    [StringLength(20, ErrorMessage = "El teléfono debe tener máximo 20 caracteres")]
    public string Telefono { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "El email no tiene un formato válido")]
    public string? Email { get; set; }

    public string? Notas { get; set; }
}

public class ClienteRequest : ClienteBase { }

public class ClienteResponse : ClienteBase
{
    public int      Id            { get; set; }
    public bool     Activo        { get; set; }
    public DateTime FechaRegistro { get; set; }
}
