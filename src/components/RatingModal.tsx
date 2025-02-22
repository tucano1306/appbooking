import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from '@/hooks/useAxios';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      {/* Modal más pequeño con max-width reducido */}
      <div className="bg-white rounded-lg p-4 max-w-sm w-full">
        {/* Header más compacto */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Rate your stay</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Imagen más pequeña */}
        <div className="mb-3">
          <img 
            src={`https://hotels-api.academlo.tech/api/hotels/${hotelId}/image`}
            alt={hotelName}
            className="w-full h-32 object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/600x400/gray/white?text=Hotel+Image';
            }}
          />
        </div>
        
        {/* Información del hotel más compacta */}
        <div className="mb-3">
          <h3 className="font-semibold text-base">{hotelName}</h3>
          <div className="flex justify-between text-xs text-gray-600">
            <p>Reservation Days: {reservationDays}</p>
            <p>Subtotal: ${subtotalPrice}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="focus:outline-none p-1"
                >
                  <FaStar
                    className={`w-5 h-5 ${
                      value <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Comments</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              rows={3}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-500 text-white py-1.5 px-3 rounded-md text-sm hover:bg-red-600 transition-colors disabled:bg-red-300"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;