using Abstracciones.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IClienteFlujo
    {
        Task<IEnumerable<ClienteResponse>> Obtener();
        Task<ClienteResponse?> Obtener(int id);
        Task<IEnumerable<ClienteResponse>> Buscar(string busqueda);
        Task<int> Agregar(ClienteRequest cliente);
        Task<int> Editar(int id, ClienteRequest cliente);
        Task<int> Desactivar(int id);
    }
}
