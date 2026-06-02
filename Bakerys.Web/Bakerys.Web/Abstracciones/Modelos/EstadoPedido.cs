namespace Abstracciones.Modelos;

public class EstadoPedidoBase
{
    public string  Nombre      { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
}

public class EstadoPedidoRequest : EstadoPedidoBase { }

public class EstadoPedidoResponse : EstadoPedidoBase
{
    public int Id { get; set; }
}
