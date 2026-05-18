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
            return _clienteDA.Agregar(cliente);
        }

        public Task<IEnumerable<ClienteResponse>> Buscar(string busqueda)
        {
            return _clienteDA.Buscar(busqueda);
        }

        public Task<int> Desactivar(int id)
        {
            return _clienteDA.Desactivar(id);
        }

        public Task<int> Editar(int id, ClienteRequest cliente)
        {
            return _clienteDA.Editar(id, cliente);
        }

        public Task<IEnumerable<ClienteResponse>> Obtener()
        {
            return _clienteDA.Obtener();
        }

        public Task<ClienteResponse?> Obtener(int id)
        {
            return _clienteDA.Obtener(id);
        }
    }
}
