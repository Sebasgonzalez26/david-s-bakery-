using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class TransaccionFlujo : ITransaccionFlujo
    {
        private ITransaccionDA _transaccionDA;

        public TransaccionFlujo(ITransaccionDA transaccionDA)
        {
            _transaccionDA = transaccionDA;
        }

        public Task<IEnumerable<TransaccionResponse>> Obtener(string? tipo, string? categoria, DateTime? fechaDesde, DateTime? fechaHasta)
        {
            return _transaccionDA.Obtener(tipo, categoria, fechaDesde, fechaHasta);
        }

        public Task<TransaccionResponse?> Obtener(int id)
        {
            return _transaccionDA.Obtener(id);
        }

        public Task<int> Registrar(TransaccionRequest transaccion)
        {
            return _transaccionDA.Registrar(transaccion);
        }

        public Task<int> Editar(int id, TransaccionRequest transaccion)
        {
            return _transaccionDA.Editar(id, transaccion);
        }

        public Task<int> Eliminar(int id)
        {
            return _transaccionDA.Eliminar(id);
        }

        public Task<ResumenFinancieroResponse> ObtenerResumen(DateTime? fechaDesde, DateTime? fechaHasta)
        {
            return _transaccionDA.ObtenerResumen(fechaDesde, fechaHasta);
        }
    }
}
