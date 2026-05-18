using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA;

public interface IClienteDA
{
    Task<IEnumerable<ClienteResponse>> Obtener();
    Task<ClienteResponse?>             Obtener(int id);
    Task<IEnumerable<ClienteResponse>> Buscar(string busqueda);
    Task<int>                          Agregar(ClienteRequest cliente);
    Task<int>                          Editar(int id, ClienteRequest cliente);
    Task<int>                          Desactivar(int id);
}
