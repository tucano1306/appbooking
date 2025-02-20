// src/components/ui/StarRating.tsx
import { FC } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

const StarRating: FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => (
        <FaStar
          key={index}
          className={`${
            index < rating ? 'text-yellow-400' : 'text-gray-300'
          } text-lg`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating})</span>
    </div>
  );
};

export default StarRating;