import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ClientesIndex from './pages/clientes/ClientesIndex'
import ClienteAgregar from './pages/clientes/ClienteAgregar'
import ClienteEditar from './pages/clientes/ClienteEditar'
import PedidosIndex from './pages/pedidos/PedidosIndex'
import PedidoAgregar from './pages/pedidos/PedidoAgregar'
import PedidoEditar from './pages/pedidos/PedidoEditar'
import PagosIndex from './pages/pagos/PagosIndex'
import InventarioIndex from './pages/inventario/InventarioIndex'
import FinanzasIndex from './pages/finanzas/FinanzasIndex'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="clientes" element={<ClientesIndex />} />
          <Route path="clientes/nuevo" element={<ClienteAgregar />} />
          <Route path="clientes/:id/editar" element={<ClienteEditar />} />

          <Route path="pedidos" element={<PedidosIndex />} />
          <Route path="pedidos/nuevo" element={<PedidoAgregar />} />
          <Route path="pedidos/:id/editar" element={<PedidoEditar />} />

          <Route path="pagos" element={<PagosIndex />} />
          <Route path="inventario" element={<InventarioIndex />} />
          <Route path="finanzas" element={<FinanzasIndex />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
