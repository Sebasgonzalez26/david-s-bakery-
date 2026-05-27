using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos;

public class PagoBase
{
    [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a cero")]
    public decimal Monto          { get; set; }
    public string  TipoPago       { get; set; } = "Adelanto"; // Adelanto | Abono | Saldo Total
    public string? ComprobanteUrl { get; set; }
    public string? Notas          { get; set; }
}

public class PagoRequest : PagoBase
{
    public int PedidoId { get; set; }
}

public class PagoResponse : PagoBase
{
    public int      Id        { get; set; }
    public int      PedidoId  { get; set; }
    public DateTime FechaPago { get; set; }
}

public class SaldoPedidoResponse
{
    public int     PedidoId       { get; set; }
    public decimal MontoTotal     { get; set; }
    public decimal TotalPagado    { get; set; }
    public decimal SaldoPendiente { get; set; }
}
