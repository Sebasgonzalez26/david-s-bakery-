using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IPedidoFlujo
    {
        Task<IEnumerable<PedidoResponse>> Obtener();
        Task<PedidoResponse?> Obtener(int id);
        Task<IEnumerable<PedidoResponse>> Buscar(string? busqueda, int? estadoId, DateTime? fechaDesde, DateTime? fechaHasta);
        Task<int> Agregar(PedidoRequest pedido);
        Task<int> ActualizarEstado(int id, int estadoId);
        Task<int> Cancelar(int id, string? motivo);

        // Detalles — siempre dentro del contexto del pedido
        Task<int> AgregarDetalle(DetallePedidoRequest detalle);

        // Estados — catálogo para llenar dropdowns
        Task<IEnumerable<EstadoPedidoResponse>> ObtenerEstados();
    }
}
