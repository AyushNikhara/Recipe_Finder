import React from 'react';
import { Clock, Users, Star, Heart } from 'lucide-react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  isSaved?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, isSaved }) => {
  return (
    <div
      className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-[1.02] cursor-pointer"
      onClick={() => onClick(recipe)}
    >
      <div className="relative h-48">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-lg font-semibold text-white">{recipe.name}</h3>
        </div>
        {isSaved && (
          <div className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-md">
            <Heart className="h-5 w-5 fill-blue-500 text-blue-500" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{recipe.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;