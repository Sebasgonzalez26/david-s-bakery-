import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import Login from './pages/auth/Login'
import Registro from './pages/auth/Registro'
import { authService } from './services/authService'

function RutaProtegida({ children }: { children: React.ReactNode }) {
  return authService.estaAutenticado() ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route path="/" element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }>
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
