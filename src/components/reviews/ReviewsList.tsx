import { FC, useState } from 'react';
import ReviewCard from './ReviewCard';
import { Review } from '@/types/review';

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList: FC<ReviewsListProps> = ({ reviews }) => {
  const [visibleItems, setVisibleItems] = useState(5);
  const increment = 5;

  // Asegurarse de que reviews sea un array
  const reviewsArray = Array.isArray(reviews) ? reviews : [];

  const loadMore = () => {
    setVisibleItems(prev => prev + increment);
  };

  const itemsToShow = reviewsArray.slice(0, visibleItems);

  if (reviewsArray.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {itemsToShow.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}

      {visibleItems < reviewsArray.length && (
        <button
          onClick={loadMore}
          className="w-full py-2 text-red-500 hover:text-red-600 font-medium text-center"
        >
          Load more reviews
        </button>
      )}
    </div>
  );
};

export default ReviewsList;