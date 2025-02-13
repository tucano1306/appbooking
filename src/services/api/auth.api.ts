import api from './axios.config'

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  }
}