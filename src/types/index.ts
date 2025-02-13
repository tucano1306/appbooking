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

export interface City {
  id: number
  name: string
  country: string
}

export interface Review {
  id: number
  userId: number
  hotelId: number
  rating: number
  comment: string
}

export interface Booking {
  id: number
  userId: number
  hotelId: number
  checkIn: string
  checkOut: string
}