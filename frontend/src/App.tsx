import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Bookmark, ChefHat } from 'lucide-react';
import axios from 'axios';
import IngredientInput from './components/IngredientInput';
import DietaryPreferences from './components/DietaryPreferences';
import Filters from './components/Filters';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import ImageUpload from './components/ImageUpload';
import Button from './components/ui/Button';
import type { Recipe, Review, TimeFilter, DifficultyFilter, CuisineFilter } from './types';

function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [cuisineFilter, setCuisineFilter] = useState<CuisineFilter>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch of all recipes when component mounts
  useEffect(() => {
    fetchRecipes();
  }, []); // Empty dependency array for initial load

  // Fetch recipes when filters change
  useEffect(() => {
    if (searchActive) {
      fetchRecipes();
    }
  }, [searchActive, ingredients, dietaryPreferences, timeFilter, difficultyFilter, cuisineFilter, ratingFilter]);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (ingredients.length > 0) {
        params.append('ingredients', ingredients.join(','));
      }
      if (dietaryPreferences.length > 0) {
        params.append('dietaryPreferences', dietaryPreferences.join(','));
      }
      if (timeFilter !== 'all') {
        params.append('timeFilter', timeFilter);
      }
      if (difficultyFilter !== 'all') {
        params.append('difficultyFilter', difficultyFilter);
      }
      if (cuisineFilter !== 'all') {
        params.append('cuisineFilter', cuisineFilter);
      }
      if (ratingFilter > 0) {
        params.append('ratingFilter', ratingFilter.toString());
      }

      const response = await axios.get(`https://recipe-finder-1-iwk6.onrender.com/api/recipes?${params.toString()}`);
      setRecipes(response.data);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = useMemo(() => {
    if (showSavedOnly) {
      return recipes.filter(recipe => savedRecipes.has(recipe.id));
    }
    return recipes;
  }, [recipes, showSavedOnly, savedRecipes]);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    setSavedRecipes(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(recipe.id)) {
        newSaved.delete(recipe.id);
      } else {
        newSaved.add(recipe.id);
      }
      return newSaved;
    });
  };

  const handleAddReview = async (recipeId: string, review: Omit<Review, 'id' | 'userId' | 'createdAt'>) => {
    try {
      const response = await axios.post(
        `https://recipe-finder-1-iwk6.onrender.com/api/recipes/${recipeId}/reviews`,
        review
      );

      // Update the recipes state with the new review
      setRecipes(prevRecipes => 
        prevRecipes.map(recipe => 
          recipe.id === recipeId
            ? {
                ...recipe,
                reviews: [...recipe.reviews, response.data],
                rating: (recipe.reviews.reduce((sum, r) => sum + r.rating, 0) + review.rating) / (recipe.reviews.length + 1)
              }
            : recipe
        )
      );

      // Update selected recipe if it's the one being reviewed
      if (selectedRecipe?.id === recipeId) {
        setSelectedRecipe(prev => {
          if (!prev) return null;
          return {
            ...prev,
            reviews: [...prev.reviews, response.data],
            rating: (prev.reviews.reduce((sum, r) => sum + r.rating, 0) + review.rating) / (prev.reviews.length + 1)
          };
        });
      }
    } catch (err) {
      console.error('Error adding review:', err);
    }
  };

  const handleSearch = () => {
    setSearchActive(true);
  };

  const handleResetFilters = () => {
    setTimeFilter('all');
    setDifficultyFilter('all');
    setCuisineFilter('all');
    setRatingFilter(0);
    setDietaryPreferences([]);
    setIngredients([]);
    setSearchActive(false);
    setShowSavedOnly(false);
    fetchRecipes(); // Fetch all recipes again
  };

  const handleIngredientsExtracted = (extractedIngredients: string[]) => {
    setIngredients(prev => [...new Set([...prev, ...extractedIngredients])]);
    setSearchActive(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Recipe Finder</h1>
            </div>
            <Button
              variant={showSavedOnly ? 'primary' : 'outline'}
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className="gap-2"
            >
              <Bookmark className={showSavedOnly ? 'fill-white' : ''} />
              Saved Recipes ({savedRecipes.size})
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-6 rounded-lg bg-white p-6 shadow">
          <ImageUpload onIngredientsExtracted={handleIngredientsExtracted} />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Ingredients</h2>
            <IngredientInput 
              ingredients={ingredients}
              onIngredientsChange={setIngredients} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-5 w-5" />
                Filters {showFilters ? 'Hide' : 'Show'}
              </Button>
              {(searchActive || ingredients.length > 0 || dietaryPreferences.length > 0 || 
                timeFilter !== 'all' || difficultyFilter !== 'all' || cuisineFilter !== 'all' || ratingFilter > 0) && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                >
                  Reset All
                </Button>
              )}
            </div>

            <Button 
              className="gap-2"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5" />
              Find Recipes
            </Button>
          </div>

          {showFilters && (
            <div className="space-y-4 rounded-lg border border-gray-200 p-4">
              <div className="mb-4">
                <h3 className="font-medium">Dietary Preferences</h3>
                <DietaryPreferences
                  selected={dietaryPreferences}
                  onChange={setDietaryPreferences}
                />
              </div>
              
              <Filters
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
                difficultyFilter={difficultyFilter}
                setDifficultyFilter={setDifficultyFilter}
                cuisineFilter={cuisineFilter}
                setCuisineFilter={setCuisineFilter}
                ratingFilter={ratingFilter}
                setRatingFilter={setRatingFilter}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading recipes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={handleRecipeClick}
                  isSaved={savedRecipes.has(recipe.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  {showSavedOnly 
                    ? "You haven't saved any recipes yet."
                    : "No recipes found with the selected ingredients and preferences."}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onSave={handleSaveRecipe}
          onAddReview={handleAddReview}
          isSaved={savedRecipes.has(selectedRecipe.id)}
        />
      )}
    </div>
  );
}

export default App;
