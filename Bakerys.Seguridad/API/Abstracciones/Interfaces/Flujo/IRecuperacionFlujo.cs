namespace Abstracciones.Interfaces.Flujo
{
    public interface IRecuperacionFlujo
    {
        Task       SolicitarRecuperacion(string correo);
        Task<bool> ValidarToken(string token);
        Task       RestablecerPassword(string token, string passwordHash);
    }
}
