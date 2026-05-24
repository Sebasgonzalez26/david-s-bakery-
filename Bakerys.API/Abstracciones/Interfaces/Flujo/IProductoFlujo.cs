using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo;

public interface IProductoFlujo
{
    Task<IEnumerable<ProductoResponse>> Obtener(string? categoria, bool soloActivos, bool soloStockBajo);
    Task<ProductoResponse?>             Obtener(int id);
    Task<int>                           Agregar(ProductoRequest producto);
    Task<int>                           Editar(int id, ProductoRequest producto);
    Task<int>                           Desactivar(int id);
}
