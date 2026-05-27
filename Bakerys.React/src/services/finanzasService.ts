import api from './api'
import type { ResumenFinanciero, Transaccion, TransaccionRequest } from '../types'

export const finanzasService = {
  getResumen: (mes: number, anio: number) =>
    api.get<ResumenFinanciero>(`/Transaccion/Resumen?mes=${mes}&anio=${anio}`),
  getAll: () => api.get<Transaccion[]>('/Transaccion'),
  create: (data: TransaccionRequest) => api.post('/Transaccion', data),
  delete: (id: number) => api.delete(`/Transaccion/${id}`),
}
