import api from './axios.config'

export const bookingsApi = {
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings')
      return response.data
    } catch (error: any) {
      console.error('Error fetching user bookings:', error.response?.data || error.message)
      throw error
    }
  },
  
  createBooking: async (bookingData: any) => {
    try {
      const response = await api.post('/bookings', bookingData)
      return response.data
    } catch (error: any) {
      console.error('Error creating booking:', error.response?.data || error.message)
      throw error
    }
  },
  
  cancelBooking: async (bookingId: string) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`)
      return response.data
    } catch (error: any) {
      console.error('Error canceling booking:', error.response?.data || error.message)
      throw error
    }
  }
}