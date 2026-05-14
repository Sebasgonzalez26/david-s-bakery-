using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Dapper;
using Microsoft.Data.SqlClient;

namespace DA
{
    public class PedidoDA : IPedidoDA
    {
        private IRepositorioDapper _repositorioDapper;
        private SqlConnection _sqlconexion;

        public PedidoDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlconexion = (SqlConnection)_repositorioDapper.ObtenerRepositorio();
        }

        public async Task<int> Agregar(PedidoRequest pedido)
        {
            string query = "sp_CrearPedido";
            var resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                ClienteId           = pedido.ClienteId,
                FechaEntrega        = pedido.FechaEntrega,
                MontoTotal          = pedido.MontoTotal,
                ImagenReferenciaUrl = pedido.ImagenReferenciaUrl,
                Notas               = pedido.Notas
            });
            return resultado;
        }

        public async Task<int> AgregarDetalle(DetallePedidoRequest detalle)
        {
            string query = "sp_AgregarDetallePedido";
            var resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                PedidoId       = detalle.PedidoId,
                Descripcion    = detalle.Descripcion,
                Sabor          = detalle.Sabor,
                Tamanio        = detalle.Tamanio,
                Decoracion     = detalle.Decoracion,
                Cantidad       = detalle.Cantidad,
                PrecioUnitario = detalle.PrecioUnitario
            });
            return resultado;
        }

        public async Task<IEnumerable<PedidoResponse>> Obtener()
        {
            string query = "sp_ObtenerPedidos";
            var resultado = await _sqlconexion.QueryAsync<PedidoResponse>(query);
            return resultado;
        }

        public async Task<PedidoResponse> Obtener(int id)
        {
            string query = "sp_ObtenerPedidoPorId";

            // El SP devuelve 3 result sets: pedido, detalles y pagos
            using var multi = await _sqlconexion.QueryMultipleAsync(query, new { PedidoId = id });

            var pedido   = await multi.ReadFirstOrDefaultAsync<PedidoResponse>();
            var detalles = await multi.ReadAsync<DetallePedidoResponse>();
            var pagos    = await multi.ReadAsync<PagoResponse>();

            if (pedido != null)
            {
                pedido.Detalles = detalles.ToList();
                pedido.Pagos    = pagos.ToList();
            }

            return pedido;
        }

        public async Task<IEnumerable<PedidoResponse>> Buscar(string? busqueda, int? estadoId, DateOnly? fechaDesde, DateOnly? fechaHasta)
        {
            string query = "sp_ObtenerPedidos";
            var resultado = await _sqlconexion.QueryAsync<PedidoResponse>(query, new
            {
                Busqueda   = busqueda,
                EstadoId   = estadoId,
                FechaDesde = fechaDesde,
                FechaHasta = fechaHasta
            });
            return resultado;
        }

        public async Task<int> ActualizarEstado(int id, int estadoId)
        {
            string query = "sp_ActualizarEstadoPedido";
            var resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                PedidoId    = id,
                NuevoEstado = estadoId
            });
            return resultado;
        }

        public async Task<int> Cancelar(int id, string? motivo)
        {
            string query = "sp_CancelarPedido";
            var resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                PedidoId = id,
                Motivo   = motivo
            });
            return resultado;
        }

        public async Task<IEnumerable<EstadoPedidoResponse>> ObtenerEstados()
        {
            // Catálogo simple — query directo sin SP
            string query = "SELECT EstadoId AS Id, Nombre, Descripcion FROM EstadosPedido";
            var resultado = await _sqlconexion.QueryAsync<EstadoPedidoResponse>(query);
            return resultado;
        }
    }
}
