using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos;

public class DetallePedidoBase
{
    [Required(ErrorMessage = "La descripción es requerida")]
    [StringLength(200, ErrorMessage = "La descripción debe tener máximo 200 caracteres")]
    public string  Descripcion    { get; set; } = string.Empty;
    public string? Sabor          { get; set; }
    public string? Tamanio        { get; set; }
    public string? Decoracion     { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a cero")]
    public int     Cantidad       { get; set; } = 1;

    [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a cero")]
    public decimal PrecioUnitario { get; set; }
}

public class DetallePedidoRequest : DetallePedidoBase
{
    public int PedidoId { get; set; }
}

public class DetallePedidoResponse : DetallePedidoBase
{
    public int     Id       { get; set; }
    public int     PedidoId { get; set; }
    public decimal Subtotal => Cantidad * PrecioUnitario;
}
