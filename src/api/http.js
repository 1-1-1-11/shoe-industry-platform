import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 1000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('shoe_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default http
