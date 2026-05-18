using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class ProductoBase
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(100, ErrorMessage = "El nombre debe tener máximo 100 caracteres")]
        public string  Nombre         { get; set; } = string.Empty;

        [Required(ErrorMessage = "La categoría es requerida")]
        [StringLength(50, ErrorMessage = "La categoría debe tener máximo 50 caracteres")]
        public string  Categoria      { get; set; } = string.Empty;

        [Required(ErrorMessage = "La unidad de medida es requerida")]
        [StringLength(20, ErrorMessage = "La unidad de medida debe tener máximo 20 caracteres")]
        public string  UnidadMedida   { get; set; } = string.Empty;

        [Range(0, double.MaxValue, ErrorMessage = "El stock mínimo no puede ser negativo")]
        public decimal StockMinimo    { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "El precio unitario debe ser mayor a cero")]
        public decimal PrecioUnitario { get; set; }
    }

    public class ProductoRequest : ProductoBase
    {
        [Range(0, double.MaxValue, ErrorMessage = "El stock actual no puede ser negativo")]
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
}
