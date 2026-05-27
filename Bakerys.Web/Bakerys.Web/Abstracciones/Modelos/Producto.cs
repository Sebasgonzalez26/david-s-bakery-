using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos;

public class ProductoBase
{
    [Required(ErrorMessage = "El nombre es requerido")]
    [StringLength(100)]
    public string Nombre       { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Categoria    { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string UnidadMedida { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal StockMinimo  { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal PrecioUnitario { get; set; }
}

public class ProductoRequest : ProductoBase
{
    [Range(0, double.MaxValue)]
    public decimal StockActual { get; set; }
}

public class ProductoResponse : ProductoBase
{
    public int      Id            { get; set; }
    public decimal  StockActual   { get; set; }
    public bool     StockBajo     { get; set; }
    public bool     Activo        { get; set; }
    public DateTime FechaCreacion { get; set; }

    public List<MovimientoInventarioResponse> Movimientos { get; set; } = new();
}
