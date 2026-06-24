import http from './http'

export const manufacturingApi = {
  list: () => http.get('/manufacturing'),
  create: (payload) => http.post('/manufacturing', payload),
  update: (id, payload) => http.put(`/manufacturing/${id}`, payload),
  remove: (id) => http.delete(`/manufacturing/${id}`),
}
