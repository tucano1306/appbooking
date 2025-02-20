import { FC } from 'react'

interface HotelData {
  id: number
  name: string
  image: string
  rating: number
  city: {
    name: string
    country: string
  }
  price: number
}

interface OtherHotelsProps {
  hotels: HotelData[]
  country: string
}

const OtherHotels: FC<OtherHotelsProps> = ({ hotels, country }) => {
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
    }
    
    try {
      // Limpiar la URL de dobles slashes y espacios
      const cleanUrl = imageUrl.trim().replace(/\/+/g, '/')
      
      // Si ya es una URL completa, retornarla
      if (cleanUrl.startsWith('http')) {
        return cleanUrl
      }
      
      // Construir la URL completa
      return `https://hotels-api.academlo.tech${cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`}`
    } catch (error) {
      console.error('Error processing image URL:', error, imageUrl)
      return 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-lg ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Other Hotels in <span className="text-red-500">{country}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div 
            key={hotel.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform"
          >
            <div className="relative h-48 bg-gray-200">
              <img
                src={getImageUrl(hotel.image)}
                alt={hotel.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('Image failed to load:', hotel.image)
                  const target = e.target as HTMLImageElement
                  target.src = 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
              <div className="flex items-center mb-2">
                {renderStars(hotel.rating)}
                <span className="ml-2 text-gray-600">
                  ({Number(hotel.rating).toFixed(2)})
                </span>
              </div>
              <p className="text-gray-600 mb-3">
                {hotel.city.name}, {hotel.city.country}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  ${hotel.price}
                </span>
                <a
                  href={`/hotels/${hotel.id}`}
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
  )
}

export default OtherHotels