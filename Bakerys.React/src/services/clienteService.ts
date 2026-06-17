import api from './api'
import type { Cliente, ClienteRequest } from '../types'

export const clienteService = {
  getAll: () => api.get<Cliente[]>('/Cliente'),
  getById: (id: number) => api.get<Cliente>(`/Cliente/${id}`),
  create: (data: ClienteRequest) => api.post('/Cliente', data),
  update: (id: number, data: ClienteRequest) => api.put(`/Cliente/${id}`, data),
  deactivate: (id: number) => api.delete(`/Cliente/${id}`),
  activate: (id: number) => api.put(`/Cliente/${id}/activar`),
}
