import { useState, useEffect } from 'react'
import Filters from '@/components/Filters'
import { FaSearch } from 'react-icons/fa'
import axiosInstance from '@/hooks/useAxios'
import type { City } from '@/types'
import HotelsList from '@/components/HotelsList'

interface Hotel {
  id: number
  name: string
  rating: number
  city: {
    id: number
    name: string
    country: string
  }
  price: number
  images: {
    url: string
  }[]
  image?: string // Para mantener compatibilidad con la API actual
}

const Home = () => {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get<Hotel[]>('/hotels')
        
        // Log para debugging
        console.log('Raw API response:', response.data[0])
        
        const transformedHotels = response.data.map(hotel => {
          // Log para cada hotel
          console.log('Processing hotel:', hotel.name, 'Image:', hotel.image)
          
          return {
            ...hotel,
            // Asegurarnos de que la imagen tenga la ruta correcta
            image: hotel.image?.startsWith('http') 
              ? hotel.image 
              : `https://hotels-api.academlo.tech/${hotel.image?.replace(/^\//, '')}`
          }
        })
        
        // Log del resultado transformado
        console.log('Transformed hotel example:', transformedHotels[0])
        
        setHotels(transformedHotels)
        setFilteredHotels(transformedHotels)
        
        const uniqueCities = Array.from(
          new Map(
            transformedHotels.map(hotel => [hotel.city.id, hotel.city])
          ).values()
        )
        setCities(uniqueCities)
      } catch (err) {
        console.error('Error fetching hotels:', err)
        setError('Error loading hotels')
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchHotels()
  }, [])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (!value.trim()) {
      setFilteredHotels(hotels)
      return
    }

    const filtered = hotels.filter(hotel => 
      hotel.name.toLowerCase().includes(value.toLowerCase()) ||
      hotel.city.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredHotels(filtered)
  }

  const handlePriceFilter = (min: number, max: number) => {
    if (min === 0 && max === 0) {
      setFilteredHotels(hotels)
      return
    }
    
    const filtered = hotels.filter(hotel => 
      hotel.price >= min && (max === 0 || hotel.price <= max)
    )
    setFilteredHotels(filtered)
  }

  const handleCityFilter = (cityName: string) => {
    if (cityName === 'All Cities') {
      setFilteredHotels(hotels)
    } else {
      const filtered = hotels.filter(hotel => hotel.city.name === cityName)
      setFilteredHotels(filtered)
    }
  }

  if (isLoading) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Filters
          onPriceFilter={handlePriceFilter}
          onCityFilter={handleCityFilter}
          cities={cities}
        />
      </div>
      <div className="md:col-span-3">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search hotels..."
              className="w-full p-3 pl-10 border rounded"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {filteredHotels.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            No hotels found
          </div>
        ) : (
          <HotelsList hotels={filteredHotels} />
        )}
      </div>
    </div>
  )
}

export default Home