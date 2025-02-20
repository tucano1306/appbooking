import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from '@/hooks/useAxios';

// Define explícitamente las props del componente
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: number;
  hotelName: string;
  reservationDays: number;
  subtotalPrice: number;
}

const RatingModal: React.FC<RatingModalProps> = ({ 
  isOpen, 
  onClose, 
  hotelId, 
  hotelName, 
  reservationDays, 
  subtotalPrice 
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await axios.post(`/reviews`, {
        hotelId,
        rating,
        comment,
        propertyType: 'hotel'
      });

      console.log('Review submitted successfully:', response.data);
      
      onClose();
      setRating(5);
      setComment('');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.message || 'Error al enviar la reseña. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Rate your stay</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <img 
            src={`https://hotels-api.academlo.tech/api/hotels/${hotelId}/image`}
            alt={hotelName}
            className="w-full h-48 object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/600x400/gray/white?text=Hotel+Image';
            }}
          />
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold text-lg">{hotelName}</h3>
          <p className="text-sm text-gray-600">Reservation Days: {reservationDays}</p>
          <p className="text-sm text-gray-600">Subtotal: ${subtotalPrice}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="focus:outline-none"
                >
                  <FaStar
                    className={`w-6 h-6 ${
                      value <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Comments</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors disabled:bg-red-300"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;