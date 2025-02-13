import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

const axiosInstance = axios.create({
  baseURL: 'https://hotels-api.academlo.tech',
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance