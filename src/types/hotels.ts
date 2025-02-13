export interface Hotel {
    id: number
    name: string
    description: string
    image: string
    images: string[]
    city: {
      id: number
      name: string
      country: string
    }
    rating: number
    price: number
  }
  
  export interface HotelSearchParams {
    city?: string
    country?: string
    minPrice?: number
    maxPrice?: number
    rating?: number
  }
  
  export interface HotelFilters {
    minPrice?: number
    maxPrice?: number
    city?: string
  }
  
  export interface Review {
    id: number
    userId: number
    hotelId: number
    rating: number
    comment: string
    createdAt: string
  }
  
  export interface Booking {
    id: number
    userId: number
    hotelId: number
    checkIn: string
    checkOut: string
    status: 'pending' | 'confirmed' | 'cancelled'
    createdAt: string
  }