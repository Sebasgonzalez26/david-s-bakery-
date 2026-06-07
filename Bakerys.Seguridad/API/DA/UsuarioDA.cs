using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Dapper;
using Microsoft.Data.SqlClient;

namespace DA
{
    public class UsuarioDA : IUsuarioDA
    {
        private readonly SqlConnection _sqlConnection;

        public UsuarioDA(IRepositorioDapper repositorioDapper)
        {
            _sqlConnection = repositorioDapper.ObtenerRepositorio();
        }

        public async Task<Usuario?> ObtenerUsuario(UsuarioBase usuario)
        {
            var resultado = await _sqlConnection.QueryAsync<Usuario>(
                "ObtenerUsuario",
                new { NombreUsuario = usuario.NombreUsuario, CorreoElectronico = usuario.CorreoElectronico },
                commandType: System.Data.CommandType.StoredProcedure);
            return resultado.FirstOrDefault();
        }

        public async Task<IEnumerable<Perfil>> ObtenerPerfilesxUsuario(UsuarioBase usuario)
        {
            return await _sqlConnection.QueryAsync<Perfil>(
                "ObtenerPerfilesxUsuario",
                new { NombreUsuario = usuario.NombreUsuario, CorreoElectronico = usuario.CorreoElectronico },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Guid> CrearUsuario(UsuarioBase usuario)
        {
            return await _sqlConnection.ExecuteScalarAsync<Guid>(
                "AgregarUsuario",
                new { NombreUsuario = usuario.NombreUsuario, CorreoElectronico = usuario.CorreoElectronico, PasswordHash = usuario.PasswordHash },
                commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}
