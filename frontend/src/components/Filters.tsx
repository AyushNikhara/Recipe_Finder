import React from 'react';
import { Clock, Gauge, Globe, Star } from 'lucide-react';
import Button from './ui/Button';
import type { TimeFilter, DifficultyFilter, CuisineFilter } from '../types';

interface FiltersProps {
  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
  difficultyFilter: DifficultyFilter;
  setDifficultyFilter: (filter: DifficultyFilter) => void;
  cuisineFilter: CuisineFilter;
  setCuisineFilter: (filter: CuisineFilter) => void;
  ratingFilter: number;
  setRatingFilter: (rating: number) => void;
}

const Filters: React.FC<FiltersProps> = ({
  timeFilter,
  setTimeFilter,
  difficultyFilter,
  setDifficultyFilter,
  cuisineFilter,
  setCuisineFilter,
  ratingFilter,
  setRatingFilter,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">Cooking Time</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'under15', label: 'Under 15 min' },
            { value: 'under30', label: 'Under 30 min' },
            { value: 'under60', label: 'Under 1 hour' },
            { value: 'under75', label: 'Under 1.5 hour' },
            { value: 'under80', label: 'Under 2 hour' },


          ].map((option) => (
            <Button
              key={option.value}
              variant={timeFilter === option.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(option.value as TimeFilter)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">Difficulty Level</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' },
          ].map((option) => (
            <Button
              key={option.value}
              variant={difficultyFilter === option.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setDifficultyFilter(option.value as DifficultyFilter)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">Cuisine Type</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'italian', label: 'Italian' },
            { value: 'asian', label: 'Asian' },
            { value: 'mediterranean', label: 'Mediterranean' },
            { value: 'mexican', label: 'Mexican' },
            { value: 'american', label: 'American' },
            {value: 'italian-american', label:'Italian-American'},
            {value: 'greek', label: 'Greek'},
            {value: 'russian', label: 'Russian'},
            {value: 'indian', label: 'Indian'},
            {value: 'south indian', label: 'South Indian'},

          ].map((option) => (
            <Button
              key={option.value}
              variant={cuisineFilter === option.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCuisineFilter(option.value as CuisineFilter)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">Minimum Rating</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant={ratingFilter === rating ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setRatingFilter(rating)}
            >
              {rating === 0 ? 'All' : `${rating}+ ★`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;