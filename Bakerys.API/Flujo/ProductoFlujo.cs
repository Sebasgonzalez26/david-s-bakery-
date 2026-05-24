using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class ProductoFlujo : IProductoFlujo
    {
        private IProductoDA _productoDA;

        public ProductoFlujo(IProductoDA productoDA)
        {
            _productoDA = productoDA;
        }

        public Task<IEnumerable<ProductoResponse>> Obtener(string? categoria, bool soloActivos, bool soloStockBajo)
        {
            return _productoDA.Obtener(categoria, soloActivos, soloStockBajo);
        }

        public Task<ProductoResponse?> Obtener(int id)
        {
            return _productoDA.Obtener(id);
        }

        public Task<int> Agregar(ProductoRequest producto)
        {
            return _productoDA.Agregar(producto);
        }

        public Task<int> Editar(int id, ProductoRequest producto)
        {
            return _productoDA.Editar(id, producto);
        }

        public Task<int> Desactivar(int id)
        {
            return _productoDA.Desactivar(id);
        }
    }
}
