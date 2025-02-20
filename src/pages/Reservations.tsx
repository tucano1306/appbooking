import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '@/hooks/useAxios'
import RatingModal from '@/components/RatingModal'

interface Booking {
  id: number
  hotelId: number
  checkIn: string
  checkOut: string
  hotel: {
    name: string
    image: string
    city: {
      name: string
      country: string
    }
  }
}

const Reservations = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/bookings')
      setBookings(response.data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load reservations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleDelete = async (bookingId: number) => {
    try {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta reservación?')) {
        await axios.delete(`/bookings/${bookingId}`)
        setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId))
      }
    } catch (err) {
      console.error('Error deleting booking:', err)
      setError('Failed to delete reservation')
    }
  }

  const calculateReservationDays = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateSubtotal = (days: number) => {
    const pricePerNight = 487 // Precio por noche en USD
    return days * pricePerNight
  }

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
    }
    
    try {
      const cleanUrl = imageUrl.trim().replace(/\/+/g, '/')
      if (cleanUrl.startsWith('http')) {
        return cleanUrl
      }
      return `https://hotels-api.academlo.tech/${cleanUrl.replace(/^\/+/, '')}`
    } catch (error) {
      return 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        {error}
      </div>
    )
  }

  if (!bookings.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Mis Reservaciones</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">
            No hay reservaciones activas. Para escoger un hotel y reservar{' '}
            <Link to="/" className="text-red-500 hover:text-red-600">
              ir a Home
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Mis Reservaciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => {
          const reservationDays = calculateReservationDays(booking.checkIn, booking.checkOut)
          const subtotal = calculateSubtotal(reservationDays)
          
          return (
            <div 
              key={booking.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={getImageUrl(booking.hotel.image)}
                alt={booking.hotel.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
                }}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {booking.hotel.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {booking.hotel.city.name}, {booking.hotel.city.country}
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                  <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                  <p>Días de reserva: {reservationDays}</p>
                  <p>Subtotal: ${subtotal}</p>
                </div>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                  >
                    Eliminar Reservación
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBooking(booking)
                      setIsRatingModalOpen(true)
                    }}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                  >
                    Rate and comment this visit...
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedBooking && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => {
            setIsRatingModalOpen(false)
            setSelectedBooking(null)
          }}
          hotelId={selectedBooking.hotelId}
          hotelName={selectedBooking.hotel.name}
          reservationDays={calculateReservationDays(selectedBooking.checkIn, selectedBooking.checkOut)}
          subtotalPrice={calculateSubtotal(calculateReservationDays(selectedBooking.checkIn, selectedBooking.checkOut))}
        />
      )}
    </div>
  )
}

export default Reservations