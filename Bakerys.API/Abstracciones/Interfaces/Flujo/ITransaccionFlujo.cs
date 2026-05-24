using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo;

public interface ITransaccionFlujo
{
    Task<IEnumerable<TransaccionResponse>> Obtener(string? tipo, string? categoria, DateTime? fechaDesde, DateTime? fechaHasta);
    Task<TransaccionResponse?>             Obtener(int id);
    Task<int>                              Registrar(TransaccionRequest transaccion);
    Task<int>                              Editar(int id, TransaccionRequest transaccion);
    Task<int>                              Eliminar(int id);
    Task<ResumenFinancieroResponse>        ObtenerResumen(DateTime? fechaDesde, DateTime? fechaHasta);
}
