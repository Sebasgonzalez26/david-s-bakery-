using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Dapper;

namespace DA
{
    public class UsuarioDA : IUsuarioDA
    {
        private readonly IRepositorioDapper _repositorioDapper;

        public UsuarioDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
        }

        public async Task<Usuario?> ObtenerUsuario(UsuarioBase usuario)
        {
            using var conn = _repositorioDapper.ObtenerRepositorio();
            var resultado  = await conn.QueryAsync<Usuario>(
                "ObtenerUsuario",
                new { NombreUsuario = usuario.NombreUsuario, CorreoElectronico = usuario.CorreoElectronico },
                commandType: System.Data.CommandType.StoredProcedure);
            return resultado.FirstOrDefault();
        }

        public async Task<IEnumerable<Perfil>> ObtenerPerfilesxUsuario(UsuarioBase usuario)
        {
            using var conn = _repositorioDapper.ObtenerRepositorio();
            return await conn.QueryAsync<Perfil>(
                "ObtenerPerfilesxUsuario",
                new { NombreUsuario = usuario.NombreUsuario, CorreoElectronico = usuario.CorreoElectronico },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> CrearUsuario(UsuarioBase usuario)
        {
            using var conn = _repositorioDapper.ObtenerRepositorio();
            return await conn.ExecuteScalarAsync<Guid>(
                "AgregarUsuario",
                new { NombreUsuario = usuario.NombreUsuario, CorreoElectronico = usuario.CorreoElectronico, PasswordHash = usuario.PasswordHash },
                commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}
