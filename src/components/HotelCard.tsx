import { useState } from 'react'
import { Link } from 'react-router-dom'

interface HotelCardProps {
  id: number
  name: string
  image: string
  rating: number | string
  city: string
  country: string
  price: number | string // Modificado para aceptar string también
}

const HotelCard = ({ id, name, image, rating, city, country, price }: HotelCardProps) => {
  const [imgError, setImgError] = useState(false)

  const getImageUrl = (imageUrl: string) => {
    if (imgError || !imageUrl) {
      return 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }

    const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl
    const fullUrl = `https://hotels-api.academlo.tech/${cleanPath}`
    return fullUrl
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImgError(true)
    e.currentTarget.src = 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
  }

  // Asegurar que rating sea un número
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating
  const displayRating = !isNaN(numericRating) ? numericRating : 0

  // Asegurar que price sea un número
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  const displayPrice = !isNaN(numericPrice) ? numericPrice : 0

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105">
      <div className="h-40 bg-gray-200 relative">
        <img
          src={getImageUrl(image)}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <div className="p-3">
        <h3 className="text-lg font-semibold mb-1 truncate text-gray-800">{name}</h3>
        <div className="flex items-center mb-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-lg ${i < Math.floor(displayRating) ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
          <span className="ml-1 text-sm text-gray-600">
            ({typeof displayRating === 'number' ? displayRating.toFixed(1) : '0.0'})
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {city}, {country}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-red-500">
            ${displayPrice}
          </span>
          <Link
            to={`/hotels/${id}`}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
          >
            See more...
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HotelCard