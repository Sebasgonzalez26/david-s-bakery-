namespace Abstracciones.Interfaces.DA
{
    public interface IRecuperacionDA
    {
        Task<string?> CrearToken(string correo);
        Task<bool>    ValidarToken(string token);
        Task          ActualizarPassword(string token, string passwordHash);
    }
}
