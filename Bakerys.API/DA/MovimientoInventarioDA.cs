using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Dapper;
using Microsoft.Data.SqlClient;

namespace DA
{
    public class MovimientoInventarioDA : IMovimientoInventarioDA
    {
        private IRepositorioDapper _repositorioDapper;
        private SqlConnection      _sqlconexion;

        public MovimientoInventarioDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlconexion       = (SqlConnection)_repositorioDapper.ObtenerRepositorio();
        }

        public async Task<IEnumerable<MovimientoInventarioResponse>> ObtenerTodos()
        {
            string query    = "sp_ObtenerMovimientos";
            var    resultado = await _sqlconexion.QueryAsync<MovimientoInventarioResponse>(query,
                commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }

        public async Task<IEnumerable<MovimientoInventarioResponse>> ObtenerPorProducto(int productoId)
        {
            string query    = "sp_ObtenerMovimientosPorProducto";
            var    resultado = await _sqlconexion.QueryAsync<MovimientoInventarioResponse>(query, new
            {
                ProductoId = productoId
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }

        public async Task<int> Registrar(MovimientoInventarioRequest movimiento)
        {
            string query    = "sp_RegistrarMovimiento";
            var    resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                ProductoId     = movimiento.ProductoId,
                TipoMovimiento = movimiento.TipoMovimiento,
                Cantidad       = movimiento.Cantidad,
                Notas          = movimiento.Notas
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }
    }
}
