using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Dapper;
using Microsoft.Data.SqlClient;

namespace DA
{
    public class TransaccionDA : ITransaccionDA
    {
        private IRepositorioDapper _repositorioDapper;
        private SqlConnection      _sqlconexion;

        public TransaccionDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlconexion       = (SqlConnection)_repositorioDapper.ObtenerRepositorio();
        }

        public async Task<IEnumerable<TransaccionResponse>> Obtener(string? tipo, string? categoria, DateTime? fechaDesde, DateTime? fechaHasta)
        {
            string query    = "sp_ObtenerTransacciones";
            var    resultado = await _sqlconexion.QueryAsync<TransaccionResponse>(query, new
            {
                Tipo       = tipo,
                Categoria  = categoria,
                FechaDesde = fechaDesde,
                FechaHasta = fechaHasta
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }

        public async Task<TransaccionResponse?> Obtener(int id)
        {
            string query    = "sp_ObtenerTransaccionPorId";
            var    resultado = await _sqlconexion.QueryFirstOrDefaultAsync<TransaccionResponse>(query, new
            {
                TransaccionId = id
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }

        public async Task<int> Registrar(TransaccionRequest transaccion)
        {
            string query    = "sp_RegistrarTransaccion";
            var    resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                Tipo        = transaccion.Tipo,
                Categoria   = transaccion.Categoria,
                Descripcion = transaccion.Descripcion,
                Monto       = transaccion.Monto,
                Fecha       = transaccion.Fecha
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }

        public async Task<int> Editar(int id, TransaccionRequest transaccion)
        {
            string query    = "sp_ActualizarTransaccion";
            var    resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                TransaccionId = id,
                Tipo          = transaccion.Tipo,
                Categoria     = transaccion.Categoria,
                Descripcion   = transaccion.Descripcion,
                Monto         = transaccion.Monto,
                Fecha         = transaccion.Fecha
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }

        public async Task<int> Eliminar(int id)
        {
            string query    = "sp_EliminarTransaccion";
            var    resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                TransaccionId = id
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }

        public async Task<ResumenFinancieroResponse> ObtenerResumen(DateTime? fechaDesde, DateTime? fechaHasta)
        {
            string query    = "sp_ObtenerResumenFinanciero";
            var    resultado = await _sqlconexion.QueryFirstOrDefaultAsync<ResumenFinancieroResponse>(query, new
            {
                FechaDesde = fechaDesde,
                FechaHasta = fechaHasta
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado!;
        }
    }
}
