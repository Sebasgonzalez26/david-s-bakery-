// ── Clientes ──────────────────────────────────────
export interface Cliente {
  id: number
  nombre: string
  telefono: string
  email?: string
  notas?: string
  activo: boolean
  fechaCreacion: string
}

export interface ClienteRequest {
  nombre: string
  telefono: string
  email?: string
  notas?: string
}

// ── Pedidos ───────────────────────────────────────
export interface Pedido {
  id: number
  clienteId: number
  cliente: string
  telefono: string
  descripcion: string
  montoTotal: number
  saldoPendiente: number
  fechaEntrega: string
  fechaCreacion: string
  estado: string
}

export interface PedidoRequest {
  clienteId: number
  descripcion: string
  montoTotal: number
  fechaEntrega: string
  estado?: string
}

// ── Pagos ─────────────────────────────────────────
export interface Pago {
  id: number
  pedidoId: number
  clienteNombre: string
  monto: number
  metodoPago: string
  fecha: string
  notas?: string
}

export interface PagoRequest {
  pedidoId: number
  monto: number
  metodoPago: string
  notas?: string
}

// ── Inventario ────────────────────────────────────
export interface Producto {
  id: number
  nombre: string
  categoria: string
  unidadMedida: string
  stockActual: number
  stockMinimo: number
  precioUnitario: number
  activo: boolean
}

export interface ProductoRequest {
  nombre: string
  categoria: string
  unidadMedida: string
  stockActual: number
  stockMinimo: number
  precioUnitario: number
}

export interface MovimientoInventario {
  id: number
  productoId: number
  productoNombre: string
  tipoMovimiento: string
  cantidad: number
  fecha: string
  notas?: string
}

export interface MovimientoRequest {
  productoId: number
  tipoMovimiento: string
  cantidad: number
  notas?: string
}

// ── Finanzas ──────────────────────────────────────
export interface ResumenFinanciero {
  totalIngresos: number
  totalGastos: number
  balanceNeto: number
  mes: number
  anio: number
}

export interface Transaccion {
  id: number
  tipo: string
  descripcion: string
  monto: number
  fecha: string
  categoria: string
}

export interface TransaccionRequest {
  tipo: string
  descripcion: string
  monto: number
  fecha: string
  categoria: string
}
