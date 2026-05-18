using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class TransaccionBase
    {
        [Required(ErrorMessage = "El tipo es requerido")]
        public string Tipo { get; set; } = string.Empty;

        [Required(ErrorMessage = "La categoría es requerida")]
        public string Categoria { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a cero")]
        public decimal Monto { get; set; }
    }

    public class TransaccionRequest : TransaccionBase
    {
        public DateTime? Fecha { get; set; }
    }

    public class TransaccionResponse : TransaccionBase
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
    }
}