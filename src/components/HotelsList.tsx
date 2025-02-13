import { FC } from 'react'
import HotelCard from './HotelCard'

interface Hotel {
  id: number
  name: string
  rating: number
  city: {
    name: string
    country: string
  }
  price: number
  images: {
    url: string
  }[]
  image?: string
}

interface HotelsListProps {
  hotels: Hotel[]
}

const HotelsList: FC<HotelsListProps> = ({ hotels }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-7">
      {hotels.map(hotel => {
        const imageUrl = hotel.images?.[0]?.url || hotel.image || ''
        
        return (
          <HotelCard
            key={hotel.id}
            id={hotel.id}
            name={hotel.name}
            rating={hotel.rating}
            city={hotel.city.name}
            country={hotel.city.country}
            price={hotel.price}
            image={imageUrl}
          />
        )
      })}
    </div>
  )
}

export default HotelsList