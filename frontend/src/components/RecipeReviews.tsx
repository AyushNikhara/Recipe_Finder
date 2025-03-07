import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import Button from './ui/Button';
import type { Review } from '../types';

interface RecipeReviewsProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'userId' | 'createdAt'>) => void;
}

const RecipeReviews: React.FC<RecipeReviewsProps> = ({ reviews, onAddReview }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    onAddReview({
      rating,
      comment,
    });

    setRating(0);
    setComment('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reviews ({reviews.length})</h3>
        <Button
          variant="outline"
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Write a Review
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-gray-300 hover:text-yellow-400"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : ''
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              rows={4}
              placeholder="Share your experience with this recipe..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={rating === 0}>
              Submit Review
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeReviews;