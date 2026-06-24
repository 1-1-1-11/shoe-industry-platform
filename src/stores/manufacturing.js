import { defineStore } from 'pinia'
import { manufacturingApi } from '../api/manufacturing'
import { seedManufacturing } from '../data/seed'

const localKey = 'shoe_manufacturing_cache'

const readLocal = () => JSON.parse(localStorage.getItem(localKey) || 'null')
const writeLocal = (items) => localStorage.setItem(localKey, JSON.stringify(items))

export const useManufacturingStore = defineStore('manufacturing', {
  state: () => ({
    products: readLocal() || [],
    loading: false,
    usingMock: false,
  }),
  getters: {
    total: (state) => state.products.length,
    inProgress: (state) => state.products.filter((item) => item.status === '生产中').length,
    delayed: (state) => state.products.filter((item) => item.status === '延期风险').length,
    completedRate(state) {
      const quantity = state.products.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
      const completed = state.products.reduce((sum, item) => sum + Number(item.completed || 0), 0)
      return quantity ? Math.round((completed / quantity) * 100) : 0
    },
    byId: (state) => (id) => state.products.find((item) => item.id === id),
  },
  actions: {
    async loadProducts() {
      this.loading = true
      try {
        const { data } = await manufacturingApi.list()
        this.products = data
        this.usingMock = false
      } catch {
        this.products = readLocal() || seedManufacturing
        this.usingMock = true
      } finally {
        writeLocal(this.products)
        this.loading = false
      }
    },
    async addProduct(payload) {
      const item = { ...payload, id: payload.id || `M${Date.now()}` }
      if (!this.usingMock) {
        try {
          const { data } = await manufacturingApi.create(item)
          this.products.unshift(data)
          writeLocal(this.products)
          return
        } catch {
          this.usingMock = true
        }
      }
      this.products.unshift(item)
      writeLocal(this.products)
    },
    async updateProduct(id, payload) {
      const next = { ...payload, id }
      if (!this.usingMock) {
        try {
          await manufacturingApi.update(id, next)
        } catch {
          this.usingMock = true
        }
      }
      this.products = this.products.map((item) => (item.id === id ? next : item))
      writeLocal(this.products)
    },
    async removeProduct(id) {
      if (!this.usingMock) {
        try {
          await manufacturingApi.remove(id)
        } catch {
          this.usingMock = true
        }
      }
      this.products = this.products.filter((item) => item.id !== id)
      writeLocal(this.products)
    },
  },
})
