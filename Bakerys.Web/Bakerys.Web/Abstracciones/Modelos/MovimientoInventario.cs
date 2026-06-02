using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos;

public class MovimientoInventarioBase
{
    [Required]
    public string  TipoMovimiento { get; set; } = string.Empty; // Entrada | Salida

    [Range(0.01, double.MaxValue)]
    public decimal Cantidad       { get; set; }
}

public class MovimientoInventarioRequest : MovimientoInventarioBase
{
    [Range(1, int.MaxValue)]
    public int     ProductoId { get; set; }
    public string? Notas      { get; set; }
}

public class MovimientoInventarioResponse : MovimientoInventarioBase
{
    public int      Id         { get; set; }
    public int      ProductoId { get; set; }
    public DateTime Fecha      { get; set; }
    public string?  Notas      { get; set; }
}
