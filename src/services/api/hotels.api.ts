import api from './axios.config'
import { Hotel, HotelSearchParams, HotelFilters } from '../../types/hotels'

export const hotelsApi = {
  getAll: async (): Promise<Hotel[]> => {
    const response = await api.get('/hotels')
    return response.data
  },
  
  getById: async (id: string): Promise<Hotel> => {
    const response = await api.get(`/hotels/${id}`)
    return response.data
  },
  
  search: async (params: HotelSearchParams): Promise<Hotel[]> => {
    const response = await api.get('/hotels/search', { params })
    return response.data
  },
  
  filterByPrice: async (filters: HotelFilters): Promise<Hotel[]> => {
    const response = await api.get('/hotels/filter', { params: filters })
    return response.data
  },
  
  filterByCity: async (city: string): Promise<Hotel[]> => {
    const response = await api.get('/hotels/filter', { 
      params: { city } 
    })
    return response.data
  }
}