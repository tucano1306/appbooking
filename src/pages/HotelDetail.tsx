import { useState, useEffect } from 'react'
import { Map, Marker } from 'pigeon-maps'
import { useParams } from 'react-router-dom'
import axios from '../hooks/useAxios'
import { useAuthStore } from '../store/auth.store'
import Comments from '../components/CommentsSection'

// Función para obtener la URL de la imagen de forma segura
const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    console.log('Invalid image URL:', imageUrl)
    return 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
  }

  try {
    // Si la URL es completa, la devuelve directamente
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }

    // Remueve la barra inicial si existe y construye la URL completa
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl
    return `https://hotels-api.academlo.tech/${cleanPath}`
  } catch (error) {
    console.error('Error processing image URL:', error)
    return 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
  }
}

interface Review {
  id: number
  userId: number
  userName: string
  rating: number
  comment: string
}

interface HotelData {
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
  reviews?: Review[]
}

const HotelDetail = () => {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [hotel, setHotel] = useState<HotelData | null>(null)
  const [otherHotels, setOtherHotels] = useState<HotelData[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Obtener detalles del hotel
        const hotelResponse = await axios.get(`/hotels/${id}`)
        console.log('Raw hotel data:', hotelResponse.data)
        const hotelData: HotelData = {
          ...hotelResponse.data,
          rating: Number(hotelResponse.data.rating) || 0,
          price: Number(hotelResponse.data.price) || 0,
          images: Array.isArray(hotelResponse.data.images)
            ? hotelResponse.data.images
                .map((img: any) => {
                  if (typeof img === 'string') {
                    return getImageUrl(img)
                  } else if (typeof img?.url === 'string') {
                    return getImageUrl(img.url)
                  }
                  return null
                })
                .filter(Boolean)
            : hotelResponse.data.image
            ? [getImageUrl(hotelResponse.data.image)]
            : [],
          // Reviews de ejemplo
          reviews: [
            {
              id: 1,
              userId: 1,
              userName: "papa mama",
              rating: 4,
              comment: "hola mundo"
            },
            {
              id: 2,
              userId: 2,
              userName: "papa mama",
              rating: 5,
              comment: "hola 2"
            },
            {
              id: 3,
              userId: 3,
              userName: "papa mama",
              rating: 4,
              comment: "hola mundo como estas"
            },
            {
              id: 4,
              userId: 4,
              userName: "Fermín Gutiérrez",
              rating: 2,
              comment: "wser"
            },
            {
              id: 5,
              userId: 5,
              userName: "esteban rincon",
              rating: 5,
              comment: "jajjshhsajhs"
            }
          ]
        }
        console.log('Transformed hotel data:', hotelData)
        setHotel(hotelData)

        // Obtener otros hoteles en el mismo país
        const hotelsResponse = await axios.get('/hotels')
        const countryHotels = hotelsResponse.data
          .filter((h: HotelData) => h.city.country === hotelData.city.country && h.id !== Number(id))
          .slice(0, 3)
          .map((h: any) => ({
            ...h,
            rating: Number(h.rating) || 0,
            price: Number(h.price) || 0,
            image: getImageUrl(h.image)
          }))
        setOtherHotels(countryHotels)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load hotel details')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Please login to make a reservation')
      return
    }

    try {
      await axios.post('/bookings', {
        hotelId: id,
        checkIn,
        checkOut
      })
      alert('Reservation created successfully!')
      setCheckIn('')
      setCheckOut('')
    } catch (err) {
      console.error('Error creating reservation:', err)
      setError('Failed to create reservation')
    }
  }

  const renderStars = (rating: number) => {
    const numRating = Number(rating) || 0
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-lg ${index < Math.floor(numRating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))
  }

  const formatRating = (rating: number) => {
    const numRating = Number(rating) || 0
    return numRating.toFixed(2)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="text-center text-red-500 p-8">
        {error || 'Hotel not found'}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Información principal del hotel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>
          <div className="flex items-center mb-4">
            {renderStars(hotel.rating)}
            <span className="ml-2 text-gray-600">({formatRating(hotel.rating)})</span>
          </div>

          {/* Imágenes del hotel */}
          <div className="relative h-[400px] rounded-lg overflow-hidden mb-6">
            <img
              src={hotel.images?.[currentImageIndex] || getImageUrl(hotel.image)}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            {hotel.images && hotel.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex(prev => (prev === 0 ? hotel.images.length - 1 : prev - 1))
                  }
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  &#8249;
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex(prev => (prev === hotel.images.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  &#8250;
                </button>
              </>
            )}
          </div>

          {/* Descripción del hotel */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700">{hotel.description}</p>
          </div>

          {/* Mapa de ubicación */}
          <div className="rounded-lg overflow-hidden h-[300px]">
            <Map height={300} defaultCenter={[48.8566, 2.3522]} defaultZoom={13}>
              <Marker width={50} color="#ef4444" anchor={[48.8566, 2.3522]} />
            </Map>
          </div>
        </div>

        {/* Formulario de reserva */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-500 mb-6">Reservation</h2>
          <form onSubmit={handleReservation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="text-xl font-bold text-gray-800 my-4">${hotel.price} per night</div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Sección de comentarios */}
      <div className="mb-12">
        <Comments hotelId={id} />
      </div>

      {/* Sección de otros hoteles */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          Other Hotels in <span className="text-red-500">{hotel.city.country}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherHotels.map(otherHotel => (
            <div
              key={otherHotel.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={getImageUrl(otherHotel.image)}
                  alt={otherHotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{otherHotel.name}</h3>
                <div className="flex items-center mb-2">
                  {renderStars(otherHotel.rating)}
                  <span className="ml-2 text-gray-600">({formatRating(otherHotel.rating)})</span>
                </div>
                <p className="text-gray-600 mb-3">
                  {otherHotel.city.name}, {otherHotel.city.country}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${otherHotel.price}</span>
                  <a
                    href={`/hotels/${otherHotel.id}`}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    See more...
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HotelDetail
