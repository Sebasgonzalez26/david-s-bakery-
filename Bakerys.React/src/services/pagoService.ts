import api from './api'
import type { Pago, PagoRequest } from '../types'

export const pagoService = {
  getAll: () => api.get<Pago[]>('/Pago'),
  getByPedido: (pedidoId: number) => api.get<Pago[]>(`/Pago/Pedido/${pedidoId}`),
  create: (data: PagoRequest) => api.post('/Pago', data),
}
