using Abstracciones.Interfaces.DA;
using Abstracciones.Modelos;
using Microsoft.Data.SqlClient;
using System.Data.SqlTypes;

namespace DA
{
    public class ClienteDA : IClienteDA
    {

        private IRepositorioDapper _repositorioDapper;

        private SqlConnection _sqlconexion;

        public ClienteDA(IRepositorioDapper repositorioDapper)
        {
            _repositorioDapper = repositorioDapper;
            _sqlconexion = _repositorioDapper.ObtenerRepositorio();
        }

       


        public Task<int> Agregar(ClienteRequest cliente)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ClienteResponse>> Buscar(string busqueda)
        {
            throw new NotImplementedException();
        }

        public Task<int> Desactivar(int id)
        {
            throw new NotImplementedException();
        }

        public Task<int> Editar(int id, ClienteRequest cliente)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ClienteResponse>> Obtener()
        {
            throw new NotImplementedException();
        }

        public Task<ClienteResponse> Obtener(int id)
        {
            throw new NotImplementedException();
        }
    }
}
