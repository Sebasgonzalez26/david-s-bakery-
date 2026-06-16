import api from './api'
import type { Producto, ProductoRequest, MovimientoInventario, MovimientoRequest } from '../types'

export const inventarioService = {
  getAll: () => api.get<Producto[]>('/Producto'),
  getById: (id: number) => api.get<Producto>(`/Producto/${id}`),
  getStockBajo: () => api.get<Producto[]>('/Producto?soloStockBajo=true'),
  create: (data: ProductoRequest) => api.post('/Producto', data),
  update: (id: number, data: ProductoRequest) => api.put(`/Producto/${id}`, data),
  getMovimientos: () => api.get<MovimientoInventario[]>('/MovimientoInventario'),
  registrarMovimiento: (data: MovimientoRequest) => api.post('/MovimientoInventario', data),
}
