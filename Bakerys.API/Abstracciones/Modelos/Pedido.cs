using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos;

public class PedidoBase
{
    [Range(0.01, double.MaxValue, ErrorMessage = "El monto total debe ser mayor a cero")]
    public decimal  MontoTotal          { get; set; }
    public string?  ImagenReferenciaUrl { get; set; }
    public string?  Notas               { get; set; }
}

public class PedidoRequest : PedidoBase
{
    public int      ClienteId    { get; set; }
    public DateTime FechaEntrega { get; set; }
}

public class PedidoResponse : PedidoBase
{
    public int      Id             { get; set; }
    public int      ClienteId      { get; set; }
    public string   Cliente        { get; set; } = string.Empty;
    public string   Telefono       { get; set; } = string.Empty;
    public int      EstadoId       { get; set; }
    public string   Estado         { get; set; } = string.Empty;
    public DateTime FechaEntrega   { get; set; }
    public DateTime FechaCreacion  { get; set; }
    public decimal  TotalPagado    { get; set; }
    public decimal  SaldoPendiente { get; set; }

    // Detalles y pagos del pedido (se llenan en sp_ObtenerPedidoPorId)
    public IEnumerable<DetallePedidoResponse> Detalles { get; set; } = new List<DetallePedidoResponse>();
    public IEnumerable<PagoResponse>          Pagos    { get; set; } = new List<PagoResponse>();
}
