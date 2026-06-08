using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IUsuarioFlujo
    {
        Task<Guid> CrearUsuario(RegistroRequest registro);
    }
}
