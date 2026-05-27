import api from './api'
import type { Pedido, PedidoRequest } from '../types'

export const pedidoService = {
  getAll: () => api.get<Pedido[]>('/Pedido'),
  getById: (id: number) => api.get<Pedido>(`/Pedido/${id}`),
  getByCliente: (clienteId: number) => api.get<Pedido[]>(`/Pedido/Cliente/${clienteId}`),
  create: (data: PedidoRequest) => api.post('/Pedido', data),
  update: (id: number, data: PedidoRequest) => api.put(`/Pedido/${id}`, data),
  updateEstado: (id: number, estado: string) => api.patch(`/Pedido/${id}/Estado`, JSON.stringify(estado)),
  delete: (id: number) => api.delete(`/Pedido/${id}`),
}
