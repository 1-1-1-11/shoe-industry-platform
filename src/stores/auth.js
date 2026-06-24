import { defineStore } from 'pinia'

const savedUser = JSON.parse(localStorage.getItem('shoe_user') || 'null')

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: savedUser,
    token: localStorage.getItem('shoe_token') || '',
  }),
  getters: {
    isAuthed: (state) => Boolean(state.token),
    role: (state) => state.user?.role || 'guest',
  },
  actions: {
    login(form) {
      if (form.username !== 'admin' || form.password !== '123456') {
        throw new Error('账号或密码错误')
      }
      this.user = { name: '生产管理员', username: 'admin', role: 'admin' }
      this.token = `shoe-token-${Date.now()}`
      localStorage.setItem('shoe_user', JSON.stringify(this.user))
      localStorage.setItem('shoe_token', this.token)
    },
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('shoe_user')
      localStorage.removeItem('shoe_token')
    },
  },
})
