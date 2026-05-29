using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class MovimientoInventarioBase
    {
        [Required(ErrorMessage = "El tipo de movimiento es requerido")]
        public string  TipoMovimiento { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "La cantidad debe ser mayor a cero")]
        public decimal Cantidad       { get; set; }
    }

    public class MovimientoInventarioRequest : MovimientoInventarioBase
    {
        [Range(1, int.MaxValue, ErrorMessage = "El producto es requerido")]
        public int     ProductoId { get; set; }

        public string? Notas      { get; set; }
    }

    public class MovimientoInventarioResponse : MovimientoInventarioBase
    {
        public int      Id             { get; set; }
        public int      ProductoId     { get; set; }
        public string   ProductoNombre { get; set; } = string.Empty;
        public DateTime Fecha          { get; set; }
        public string?  Notas          { get; set; }
    }
}
