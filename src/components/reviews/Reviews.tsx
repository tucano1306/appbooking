import { FC, useEffect, useState } from 'react';
import ReviewsList from './ReviewsList';
import axios from '@/hooks/useAxios';
import { Review } from '@/types/review';

interface ReviewsProps {
  hotelId: number;
}

const Reviews: FC<ReviewsProps> = ({ hotelId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/hotels/${hotelId}/reviews`);
        
        // Asegurarnos de que la respuesta sea un array
        const reviewsData = Array.isArray(response.data) ? response.data : [];
        console.log('Reviews data:', reviewsData); // Para debugging
        setReviews(reviewsData);
      } catch (err: any) {
        console.error('Error fetching reviews:', err);
        setError(err.response?.data?.message || 'Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    if (hotelId) {
      fetchReviews();
    }
  }, [hotelId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <ReviewsList reviews={reviews || []} />
    </div>
  );
};

export default Reviews;