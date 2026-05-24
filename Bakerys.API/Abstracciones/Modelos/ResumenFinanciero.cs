namespace Abstracciones.Modelos;

public class ResumenFinancieroResponse
{
    public decimal  TotalIngresos { get; set; }
    public decimal  TotalGastos   { get; set; }
    public decimal  BalanceNeto   { get; set; }
    public DateTime FechaDesde    { get; set; }
    public DateTime FechaHasta    { get; set; }
}
