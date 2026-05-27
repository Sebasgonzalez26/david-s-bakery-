using Abstracciones.Interfaces.Reglas;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net;
using System.Text.Json;

namespace Web.Pages.Clientes
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguracion _configuracion;

        public IList<ClienteResponse> Clientes { get; set; } = new List<ClienteResponse>();

        [BindProperty(SupportsGet = true)]
        public string? Busqueda { get; set; }

        public IndexModel(IConfiguracion configuracion)
        {
            _configuracion = configuracion;
        }

        public async Task OnGet()
        {
            var opciones = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var httpCliente = new HttpClient();
            string endpoint;

            if (!string.IsNullOrWhiteSpace(Busqueda))
                endpoint = string.Format(_configuracion.ObtenerMetodo("ApiEndPoints", "BuscarClientes"), Busqueda);
            else
                endpoint = _configuracion.ObtenerMetodo("ApiEndPoints", "ObtenerClientes");

            var respuesta = await httpCliente.GetAsync(endpoint);
            if (respuesta.StatusCode == HttpStatusCode.OK)
            {
                var json = await respuesta.Content.ReadAsStringAsync();
                Clientes = JsonSerializer.Deserialize<List<ClienteResponse>>(json, opciones)
                           ?? new List<ClienteResponse>();
            }
        }

        public async Task<IActionResult> OnPostDesactivar(int id)
        {
            var httpCliente = new HttpClient();
            string endpoint = string.Format(_configuracion.ObtenerMetodo("ApiEndPoints", "DesactivarCliente"), id);
            await httpCliente.DeleteAsync(endpoint);
            return RedirectToPage("./Index");
        }
    }
}
