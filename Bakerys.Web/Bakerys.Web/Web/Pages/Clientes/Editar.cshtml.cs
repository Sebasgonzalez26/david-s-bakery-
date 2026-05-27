using Abstracciones.Interfaces.Reglas;
using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net;
using System.Text.Json;

namespace Web.Pages.Clientes
{
    public class EditarModel : PageModel
    {
        private readonly IConfiguracion _configuracion;

        [BindProperty]
        public ClienteResponse Cliente { get; set; } = new();

        public EditarModel(IConfiguracion configuracion)
        {
            _configuracion = configuracion;
        }

        public async Task<IActionResult> OnGet(int? id)
        {
            if (id == null)
                return NotFound();

            var httpCliente = new HttpClient();
            string endpoint = string.Format(_configuracion.ObtenerMetodo("ApiEndPoints", "ObtenerCliente"), id);
            var respuesta = await httpCliente.GetAsync(endpoint);

            if (respuesta.StatusCode == HttpStatusCode.OK)
            {
                var json = await respuesta.Content.ReadAsStringAsync();
                var opciones = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                Cliente = JsonSerializer.Deserialize<ClienteResponse>(json, opciones) ?? new();
            }
            else
            {
                return NotFound();
            }

            return Page();
        }

        public async Task<IActionResult> OnPost()
        {
            if (!ModelState.IsValid)
                return Page();

            var request = new ClienteRequest
            {
                Nombre   = Cliente.Nombre,
                Telefono = Cliente.Telefono,
                Email    = Cliente.Email,
                Notas    = Cliente.Notas
            };

            var httpCliente = new HttpClient();
            string endpoint = string.Format(_configuracion.ObtenerMetodo("ApiEndPoints", "EditarCliente"), Cliente.Id);
            var respuesta = await httpCliente.PutAsJsonAsync(endpoint, request);
            respuesta.EnsureSuccessStatusCode();

            return RedirectToPage("./Index");
        }
    }
}
