using Abstracciones.Interfaces.Reglas;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net;
using System.Text.Json;

namespace Web.Pages.Bakery
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguracion _configuracion;

        public IList<ClienteResponse>      Clientes    { get; set; } = new List<ClienteResponse>();
        public IList<PedidoResponse>       Pedidos     { get; set; } = new List<PedidoResponse>();
        public IList<ProductoResponse>     StockBajo   { get; set; } = new List<ProductoResponse>();
        public ResumenFinancieroResponse?  Resumen     { get; set; }

        // KPIs calculados
        public int     TotalClientes       => Clientes.Count;
        public int     PedidosActivos      => Pedidos.Count(p => p.Estado != "Entregado" && p.Estado != "Cancelado");
        public int     PedidosPendientes   => Pedidos.Count(p => p.Estado == "Pendiente");
        public int     ProductosStockBajo  => StockBajo.Count;

        public IndexModel(IConfiguracion configuracion)
        {
            _configuracion = configuracion;
        }

        public async Task OnGet()
        {
            var opciones = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            // Resumen financiero del mes actual
            var fechaDesde = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var fechaHasta = DateTime.Now;

            await Task.WhenAll(
                CargarClientes(opciones),
                CargarPedidos(opciones),
                CargarStockBajo(opciones),
                CargarResumen(opciones, fechaDesde, fechaHasta)
            );
        }

        private async Task CargarClientes(JsonSerializerOptions opciones)
        {
            try
            {
                string endpoint = _configuracion.ObtenerMetodo("ApiEndPoints", "ObtenerClientes");
                var cliente = new HttpClient();
                var respuesta = await cliente.GetAsync(endpoint);
                if (respuesta.StatusCode == HttpStatusCode.OK)
                {
                    var json = await respuesta.Content.ReadAsStringAsync();
                    Clientes = JsonSerializer.Deserialize<List<ClienteResponse>>(json, opciones)
                               ?? new List<ClienteResponse>();
                }
            }
            catch { /* continúa con lista vacía */ }
        }

        private async Task CargarPedidos(JsonSerializerOptions opciones)
        {
            try
            {
                string endpoint = _configuracion.ObtenerMetodo("ApiEndPoints", "ObtenerPedidos");
                var cliente = new HttpClient();
                var respuesta = await cliente.GetAsync(endpoint);
                if (respuesta.StatusCode == HttpStatusCode.OK)
                {
                    var json = await respuesta.Content.ReadAsStringAsync();
                    Pedidos = JsonSerializer.Deserialize<List<PedidoResponse>>(json, opciones)
                              ?? new List<PedidoResponse>();
                }
            }
            catch { /* continúa con lista vacía */ }
        }

        private async Task CargarStockBajo(JsonSerializerOptions opciones)
        {
            try
            {
                string endpoint = _configuracion.ObtenerMetodo("ApiEndPoints", "ObtenerProductos");
                var cliente = new HttpClient();
                var respuesta = await cliente.GetAsync($"{endpoint}?soloStockBajo=true");
                if (respuesta.StatusCode == HttpStatusCode.OK)
                {
                    var json = await respuesta.Content.ReadAsStringAsync();
                    StockBajo = JsonSerializer.Deserialize<List<ProductoResponse>>(json, opciones)
                                ?? new List<ProductoResponse>();
                }
            }
            catch { /* continúa con lista vacía */ }
        }

        private async Task CargarResumen(JsonSerializerOptions opciones, DateTime desde, DateTime hasta)
        {
            try
            {
                string endpoint = _configuracion.ObtenerMetodo("ApiEndPoints", "ObtenerResumen");
                var cliente = new HttpClient();
                var url = $"{endpoint}?fechaDesde={desde:yyyy-MM-dd}&fechaHasta={hasta:yyyy-MM-dd}";
                var respuesta = await cliente.GetAsync(url);
                if (respuesta.StatusCode == HttpStatusCode.OK)
                {
                    var json = await respuesta.Content.ReadAsStringAsync();
                    Resumen = JsonSerializer.Deserialize<ResumenFinancieroResponse>(json, opciones);
                }
            }
            catch { /* continúa con resumen nulo */ }
        }
    }
}
