using Abstracciones.Interfaces.DA;
using Dapper;

namespace DA
{
    public class RecuperacionDA : IRecuperacionDA
    {
        private readonly IRepositorioDapper _repositorioDapper;

        public RecuperacionDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
        }

        public async Task<string?> CrearToken(string correo)
        {
            using var conn = _repositorioDapper.ObtenerRepositorio();
            var result = await conn.QueryFirstOrDefaultAsync<dynamic>(
                "CrearTokenRecuperacion",
                new { CorreoElectronico = correo },
                commandType: System.Data.CommandType.StoredProcedure);
            return result?.Token as string;
        }

        public async Task<bool> ValidarToken(string token)
        {
            using var conn = _repositorioDapper.ObtenerRepositorio();
            var result = await conn.QueryFirstOrDefaultAsync(
                "ValidarTokenRecuperacion",
                new { Token = token },
                commandType: System.Data.CommandType.StoredProcedure);
            return result != null;
        }

        public async Task ActualizarPassword(string token, string passwordHash)
        {
            using var conn = _repositorioDapper.ObtenerRepositorio();
            await conn.ExecuteAsync(
                "ActualizarPassword",
                new { Token = token, PasswordHash = passwordHash },
                commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}
