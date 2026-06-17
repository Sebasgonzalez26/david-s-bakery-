using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Dapper;
using Microsoft.Data.SqlClient;

namespace DA
{
    public class ClienteDA : IClienteDA
    {

        private IRepositorioDapper _repositorioDapper;

        private SqlConnection _sqlconexion;

        public ClienteDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlconexion = (SqlConnection)_repositorioDapper.ObtenerRepositorio();
        }




        public async Task<int> Agregar(ClienteRequest cliente)
        {
            string query = @"sp_CrearCliente";
            var resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                Nombre   = cliente.Nombre,
                Telefono = cliente.Telefono,
                Email    = cliente.Email,
                Notas    = cliente.Notas
            });
            return resultado;
        }

        public async Task<IEnumerable<ClienteResponse>> Buscar(string busqueda)
        {
            string query = "sp_ObtenerClientes";
            var resultado = await _sqlconexion.QueryAsync<ClienteResponse>(query, new
            {
                Busqueda = busqueda
            });
            return resultado;
        }

        public async Task<int> Desactivar(int id)
        {
            string query = "sp_DesactivarCliente";
            var resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                ClienteId = id
            });
            return resultado;
        }

        public async Task<int> Activar(int id)
        {
            string query = "sp_ActivarCliente";
            var resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                ClienteId = id
            });
            return resultado;
        }

        public async Task<int> Editar(int id, ClienteRequest cliente)
        {
            string query = "sp_ActualizarCliente";
            var resultado = await _sqlconexion.ExecuteScalarAsync<int>(query, new
            {
                ClienteId = id,
                Nombre    = cliente.Nombre,
                Telefono  = cliente.Telefono,
                Email     = cliente.Email,
                Notas     = cliente.Notas
            });
            return resultado;
        }

        public async Task<IEnumerable<ClienteResponse>> Obtener()
        {
            string query = "sp_ObtenerClientes";
            var resultado = await _sqlconexion.QueryAsync<ClienteResponse>(query);
            return resultado;
        }

        public async Task<ClienteResponse?> Obtener(int id)
        {
            string query = "sp_ObtenerClientePorId";
            var resultado = await _sqlconexion.QueryFirstOrDefaultAsync<ClienteResponse>(query, new
            {
                ClienteId = id
            });
            return resultado;
        }
    }
}
