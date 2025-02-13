import { useState, useEffect } from 'react'
import axios from '../hooks/useAxios'

interface Review {
  id: number
  userId: number
  userName: string
  rating: number
  comment: string
}

interface CommentsSectionProps {
  hotelId: string | undefined
}

const CommentsSection = ({ hotelId }: CommentsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        // Ya que estamos usando datos mock, no necesitamos la respuesta de la API
        await axios.get(`/bookings?hotelId=${hotelId}`)
        
        // Datos mock para los reviews
        const mockReviews = [
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
        setReviews(mockReviews)
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError('Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }

    if (hotelId) {
      fetchReviews()
    }
  }, [hotelId])

  const displayedReviews = showAll ? reviews : reviews.slice(0, 5)

  if (loading) {
    return <div className="text-center">Loading reviews...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="pb-4 border-b last:border-0">
            <div className="flex justify-between items-start mb-1">
              <p className="font-semibold text-gray-800">{review.userName}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`text-lg ${
                      index < review.rating ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-gray-600">{review.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 mt-1">{review.comment}</p>
          </div>
        ))}
      </div>
      
      {reviews.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm font-medium bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
        >
          {showAll ? 'Show less' : 'Show more...'}
        </button>
      )}
    </div>
  )
}

export default CommentsSection