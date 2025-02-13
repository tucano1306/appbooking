import { useState } from 'react'

interface HotelCardProps {
  id: number
  name: string
  image: string
  rating: number
  city: string
  country: string
  price: number
}

const HotelCard = ({ id, name, image, rating, city, country, price }: HotelCardProps) => {
  const [imgError, setImgError] = useState(false)

  const getImageUrl = (imageUrl: string) => {
    if (imgError || !imageUrl) {
      return 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
    }

    // Log para debugging
    console.log('Original image URL:', imageUrl)

    // Si la URL ya es completa, usarla directamente
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }

    // Remover slash inicial si existe
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl

    // Construir URL completa
    const fullUrl = `https://hotels-api.academlo.tech/${cleanPath}`
    console.log('Constructed URL:', fullUrl)
    return fullUrl
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image failed to load:', image)
    setImgError(true)
    e.currentTarget.src = 'https://placehold.co/600x400/gray/white?text=Hotel+Image'
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img 
          src={getImageUrl(image)}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i}
              className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
          <span className="ml-2 text-sm text-gray-600">({rating})</span>
        </div>
        <p className="mt-2 text-gray-600">{city}, {country}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">
            ${price.toLocaleString()}
          </span>
          <a
            href={`/hotels/${id}`}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            See more...
          </a>
        </div>
      </div>
    </div>
  )
}

export default HotelCard