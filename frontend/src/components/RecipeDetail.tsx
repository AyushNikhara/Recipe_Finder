import React, { useState } from 'react';
import { Clock, Users, Star, Heart, ChefHat, ArrowLeft } from 'lucide-react';
import Button from './ui/Button';
import RecipeReviews from './RecipeReviews';
import type { Recipe, Review } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
  onSave?: (recipe: Recipe) => void;
  onAddReview: (recipeId: string, review: Omit<Review, 'id' | 'userId' | 'createdAt'>) => void;
  isSaved?: boolean;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onClose,
  onSave,
  onAddReview,
  isSaved = false,
}) => {
  const [servings, setServings] = useState(recipe.servings);
  const [activeTab, setActiveTab] = useState<'recipe' | 'reviews'>('recipe');

  const handleSave = () => {
    onSave?.(recipe);
  };

  const calculateAdjustedAmount = (amount: number) => {
    return ((amount * servings) / recipe.servings).toFixed(1);
  };

  const handleAddReview = (review: Omit<Review, 'id' | 'userId' | 'createdAt'>) => {
    onAddReview(recipe.id, review);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Back button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-gray-700 shadow-md transition-colors hover:bg-white hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="relative h-64 w-full">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-2xl font-bold text-white">{recipe.name}</h2>
            <div className="mt-1 flex items-center gap-2 text-white/90">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-sm">
                {recipe.cuisine}
              </span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-sm">
                {recipe.difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`flex-1 px-4 py-2 text-center ${
                activeTab === 'recipe'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('recipe')}
            >
              <ChefHat className="mr-2 inline-block h-5 w-5" />
              Recipe
            </button>
            <button
              className={`flex-1 px-4 py-2 text-center ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              <Star className="mr-2 inline-block h-5 w-5" />
              Reviews
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'recipe' ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-4 text-sm text-gray-600">
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
                <Button
                  variant={isSaved ? 'primary' : 'outline'}
                  onClick={handleSave}
                  className="gap-2"
                >
                  <Heart className={isSaved ? 'fill-white' : ''} />
                  {isSaved ? 'Saved' : 'Save Recipe'}
                </Button>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">Adjust Servings</h3>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setServings(Math.max(1, servings - 1))}
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium">{servings}</span>
                  <Button
                    variant="outline"
                    onClick={() => setServings(servings + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">Ingredients</h3>
                <ul className="list-inside list-disc space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">Instructions</h3>
                <ol className="list-inside list-decimal space-y-3">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="text-gray-700">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">
                  Nutritional Information
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <div className="text-sm text-gray-500">Calories</div>
                    <div className="text-lg font-semibold">
                      {calculateAdjustedAmount(recipe.nutritionalInfo.calories)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <div className="text-sm text-gray-500">Protein</div>
                    <div className="text-lg font-semibold">
                      {calculateAdjustedAmount(recipe.nutritionalInfo.protein)}g
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <div className="text-sm text-gray-500">Carbs</div>
                    <div className="text-lg font-semibold">
                      {calculateAdjustedAmount(recipe.nutritionalInfo.carbs)}g
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <div className="text-sm text-gray-500">Fat</div>
                    <div className="text-lg font-semibold">
                      {calculateAdjustedAmount(recipe.nutritionalInfo.fat)}g
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <RecipeReviews
              reviews={recipe.reviews}
              onAddReview={handleAddReview}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;