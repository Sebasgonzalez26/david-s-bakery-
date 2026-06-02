using Abstracciones.Interfaces.Reglas;
using Abstracciones.Modelos;
using Microsoft.Extensions.Configuration;

namespace Reglas;

public class Configuracion : IConfiguracion
{
    private readonly IConfiguration _configuracion;

    public Configuracion(IConfiguration configuracion)
    {
        _configuracion = configuracion;
    }

    public string ObtenerMetodo(string seccion, string nombre)
    {
        var urlBase = ObtenerUrlBase(seccion);
        var metodo  = _configuracion.GetSection(seccion).Get<APIEndPoint>()!
                          .Metodos!.Where(m => m.Nombre == nombre)
                          .FirstOrDefault()!.Valor;
        return $"{urlBase}{metodo}";
    }

    private string ObtenerUrlBase(string seccion)
    {
        return _configuracion.GetSection(seccion).Get<APIEndPoint>()!.UrlBase!;
    }
}
