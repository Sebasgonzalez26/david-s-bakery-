using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Dapper;
using Microsoft.Data.SqlClient;

namespace DA
{
    public class ProductoDA : IProductoDA
    {
        private IRepositorioDapper _repositorioDapper;
        private SqlConnection      _sqlconexion;

        public ProductoDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlconexion       = (SqlConnection)_repositorioDapper.ObtenerRepositorio();
        }

        public async Task<IEnumerable<ProductoResponse>> Obtener(string? categoria, bool soloActivos, bool soloStockBajo)
        {
            string query    = "sp_ObtenerProductos";
            var    resultado = await _sqlconexion.QueryAsync<ProductoResponse>(query, new
            {
                Categoria    = categoria,
                SoloActivos  = soloActivos,
                StockBajo    = soloStockBajo
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }

        public async Task<ProductoResponse?> Obtener(int id)
        {
            string query = "sp_ObtenerProductoPorId";

            using var multi = await _sqlconexion.QueryMultipleAsync(query, new { ProductoId = id },
                commandType: System.Data.CommandType.StoredProcedure);

            var producto     = await multi.ReadFirstOrDefaultAsync<ProductoResponse>();
            var movimientos  = await multi.ReadAsync<MovimientoInventarioResponse>();

            if (producto != null)
                producto.Movimientos = movimientos.ToList();

            return producto;
        }

        public async Task<int> Agregar(ProductoRequest producto)
        {
            string query    = "sp_CrearProducto";
            var    resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                Nombre         = producto.Nombre,
                Categoria      = producto.Categoria,
                UnidadMedida   = producto.UnidadMedida,
                StockActual    = producto.StockActual,
                StockMinimo    = producto.StockMinimo,
                PrecioUnitario = producto.PrecioUnitario
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }

        public async Task<int> Editar(int id, ProductoRequest producto)
        {
            string query    = "sp_ActualizarProducto";
            var    resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                ProductoId     = id,
                Nombre         = producto.Nombre,
                Categoria      = producto.Categoria,
                UnidadMedida   = producto.UnidadMedida,
                StockMinimo    = producto.StockMinimo,
                PrecioUnitario = producto.PrecioUnitario
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }

        public async Task<int> Desactivar(int id)
        {
            string query    = "sp_DesactivarProducto";
            var    resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                ProductoId = id
            }, commandType: System.Data.CommandType.StoredProcedure);
            return resultado;
        }
    }
}
