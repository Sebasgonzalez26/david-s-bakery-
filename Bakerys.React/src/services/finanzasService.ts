import api from './api'
import type { ResumenFinanciero, Transaccion, TransaccionRequest } from '../types'

export const finanzasService = {
  getResumen: (mes: number, anio: number) =>
    api.get<ResumenFinanciero>(`/Transaccion/Resumen?mes=${mes}&anio=${anio}`),
  getAll: (mes: number, anio: number) => {
    const desde = `${anio}-${String(mes).padStart(2, '0')}-01`
    const hasta = new Date(anio, mes, 0).toISOString().split('T')[0]
    return api.get<Transaccion[]>(`/Transaccion?fechaDesde=${desde}&fechaHasta=${hasta}`)
  },
  create: (data: TransaccionRequest) => api.post('/Transaccion', data),
  delete: (id: number) => api.delete(`/Transaccion/${id}`),
}
