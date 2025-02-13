import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookingsApi } from '../services/api/bookings.api'
import { useAuthStore } from '../store/auth.store'

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
  const [reservations, setReservations] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await bookingsApi.getUserBookings()
        setReservations(data)
      } catch (err: any) {
        console.error('Error fetching reservations:', err)
        setError('No se pudieron cargar las reservaciones')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchReservations()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">
            Por favor{' '}
            <Link to="/login" className="text-red-500 hover:text-red-600">
              inicia sesión
            </Link>{' '}
            para ver tus reservaciones
          </p>
        </div>
      </div>
    )
  }

  if (!reservations.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Mis Reservaciones</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-4xl">😕</span>
            <p className="text-gray-600">
              No hay reservaciones activas. Para escoger un hotel y reservar{' '}
              <Link to="/" className="text-red-500 hover:text-red-600">
                ir a Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Mis Reservaciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map((reservation) => (
          <div 
            key={reservation.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={reservation.hotel.image}
              alt={reservation.hotel.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
              }}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                {reservation.hotel.name}
              </h3>
              <p className="text-gray-600 mb-2">
                {reservation.hotel.city.name}, {reservation.hotel.city.country}
              </p>
              <div className="border-t pt-2">
                <p className="text-sm text-gray-600">
                  Check-in: {new Date(reservation.checkIn).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Check-out: {new Date(reservation.checkOut).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Reservations