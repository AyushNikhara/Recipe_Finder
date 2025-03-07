import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Button from './ui/Button';
import { validIngredients } from '../utils/validIngredients';

interface IngredientInputProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, onIngredientsChange }) => {
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicks outside of the suggestions box
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSuggestions = (input: string) => {
    if (!input.trim()) return [];

    const inputValue = input.toLowerCase();
    return validIngredients
      .filter(ingredient => 
        ingredient.toLowerCase().includes(inputValue) &&
        !ingredients.includes(ingredient)
      )
      .slice(0, 5); // Limit to 5 suggestions
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentIngredient(value);
    const newSuggestions = getSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const addIngredient = (ingredient: string = currentIngredient.trim()) => {
    if (ingredient && !ingredients.includes(ingredient)) {
      const newIngredients = [...ingredients, ingredient];
      onIngredientsChange(newIngredients);
      setCurrentIngredient('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    onIngredientsChange(newIngredients);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        addIngredient(suggestions[selectedIndex]);
      } else {
        addIngredient();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={currentIngredient}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Enter an ingredient"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
          <Button onClick={() => addIngredient()}>
            <Plus className="h-5 w-5" />
            Add
          </Button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                  index === selectedIndex ? 'bg-blue-50' : ''
                }`}
                onClick={() => addIngredient(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1"
          >
            <span>{ingredient}</span>
            <button
              onClick={() => removeIngredient(index)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientInput;