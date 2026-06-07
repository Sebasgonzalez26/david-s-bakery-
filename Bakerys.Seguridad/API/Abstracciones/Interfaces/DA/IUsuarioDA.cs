using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IUsuarioDA
    {
        Task<Usuario?>              ObtenerUsuario(UsuarioBase usuario);
        Task<IEnumerable<Perfil>>   ObtenerPerfilesxUsuario(UsuarioBase usuario);
        Task<Guid>                  CrearUsuario(UsuarioBase usuario);
    }
}
