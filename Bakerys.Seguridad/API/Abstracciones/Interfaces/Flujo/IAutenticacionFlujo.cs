using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IAutenticacionFlujo
    {
        Task<Token> LoginAsync(LoginRequest login);
    }
}
