using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class ClienteFlujo : IClienteFlujo
    {

        private IClienteDA _clienteDA;

        public ClienteFlujo(IClienteDA clienteDA)
        {
            _clienteDA = clienteDA;
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
