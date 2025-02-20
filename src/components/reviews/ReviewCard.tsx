import { FC } from 'react';
import { FaStar } from 'react-icons/fa';
import { Review } from '@/types/review';

interface ReviewCardProps {
  review: Review;  // Agregamos esta línea para definir la prop review
}

const ReviewCard: FC<ReviewCardProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">
            {review.user.firstName} {review.user.lastName}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(review.createdAt)}
          </p>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`${
                index < review.rating ? 'text-yellow-400' : 'text-gray-300'
              } w-5 h-5`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;