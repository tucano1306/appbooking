import { useState } from 'react'
import type { City } from '@/types'

interface FiltersProps {
  onPriceFilter: (min: number, max: number) => void
  onCityFilter: (city: string) => void
  cities: City[]
}

const Filters = ({ onPriceFilter, onCityFilter, cities }: FiltersProps) => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })
  const [selectedCity, setSelectedCity] = useState('All Cities')

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max })
    onPriceFilter(min, max)
  }

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName)
    onCityFilter(cityName)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      {/* City Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <select
          className="w-full p-2 border rounded-md"
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
        >
          <option value="All Cities">All Cities</option>
          {cities.map((city) => (
            <option key={`${city.id}-${city.name}`} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            className="p-2 border rounded-md"
            value={priceRange.min || ''}
            onChange={(e) => handlePriceChange(Number(e.target.value), priceRange.max)}
            min="0"
          />
          <input
            type="number"
            placeholder="Max"
            className="p-2 border rounded-md"
            value={priceRange.max || ''}
            onChange={(e) => handlePriceChange(priceRange.min, Number(e.target.value))}
            min="0"
          />
        </div>
      </div>

      {/* Reset Filters Button */}
      <button
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
        onClick={() => {
          setPriceRange({ min: 0, max: 0 })
          setSelectedCity('All Cities')
          onPriceFilter(0, 0)
          onCityFilter('All Cities')
        }}
      >
        Reset Filters
      </button>
    </div>
  )
}

export default Filters