import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import axios from 'axios';
import Button from './ui/Button';

interface ImageUploadProps {
  onIngredientsExtracted: (ingredients: string[]) => void;
}

// Extract all unique ingredients from the recipe database
const KNOWN_INGREDIENTS = new Set([
  // Proteins
  'chicken', 'chicken breast', 'beef', 'beef strips', 'pork', 'fish', 'shrimp', 'tofu', 'eggs', 'salmon', 'salmon fillet',
  'pancetta', 'ground beef',
  // Vegetables
  'onion', 'red onion', 'garlic', 'tomato', 'tomatoes', 'carrot', 'carrots', 'potato', 'potatoes', 'spinach', 'lettuce',
  'cucumber', 'broccoli', 'pepper', 'bell pepper', 'mushroom', 'mushrooms', 'celery', 'corn', 'peas', 'eggplant',
  // Grains & Starches
  'rice', 'basmati rice', 'pasta', 'spaghetti', 'fettuccine pasta', 'bread', 'pizza dough', 'breadcrumbs', 'quinoa',
  'egg noodles',
  // Dairy & Alternatives
  'milk', 'cheese', 'mozzarella cheese', 'parmesan cheese', 'feta cheese', 'butter', 'cream', 'heavy cream',
  'sour cream', 'yogurt',
  // Herbs & Spices
  'basil', 'fresh basil', 'thyme', 'oregano', 'rosemary', 'ginger', 'saffron', 'black pepper', 'salt',
  'parsley',
  // Pantry Items
  'olive oil', 'oil', 'soy sauce', 'vinegar', 'sugar', 'honey', 'tahini', 'lemon', 'lemon juice',
  'white wine', 'beef broth', 'vegetable broth',
  // Legumes
  'chickpeas', 'lentils',
  // Others
  'olives', 'sesame seeds', 'kale', 'sweet potato'
]);

// Words to exclude
const EXCLUDE_WORDS = new Set([
  'the', 'and', 'or', 'with', 'in', 'on', 'at', 'to', 'for', 'of', 'a', 'an',
  'image', 'picture', 'photo', 'shows', 'containing', 'dish', 'food', 'recipe',
  'made', 'using', 'contains', 'ingredients', 'cooking', 'cooked', 'prepared',
  'served', 'plate', 'bowl', 'table', 'kitchen', 'meal', 'dinner', 'lunch',
  'breakfast', 'fresh', 'raw', 'processed', 'cut', 'sliced', 'diced', 'chopped',
  'mixed', 'topped', 'garnished', 'seasoned', 'dressed', 'plated', 'arranged',
  'decorated', 'presented', 'displayed', 'visible', 'seen', 'appears', 'looks',
  'seems', 'includes', 'features', 'consists', 'comprises', 'contains'
]);

const ImageUpload: React.FC<ImageUploadProps> = ({ onIngredientsExtracted }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const isLikelyIngredient = (word: string): boolean => {
    // Remove any non-alphabetic characters and convert to lowercase
    const cleanWord = word.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    
    // Word must be at least 3 characters long
    if (cleanWord.length < 3) return false;
    
    // Exclude common non-ingredient words
    if (EXCLUDE_WORDS.has(cleanWord)) return false;
    
    // Check if it's a known ingredient (including multi-word ingredients)
    if (KNOWN_INGREDIENTS.has(cleanWord)) return true;
    
    // Check each word in multi-word phrases
    const words = cleanWord.split(' ');
    if (words.length > 1) {
      return words.some(w => KNOWN_INGREDIENTS.has(w));
    }
    
    return false;
  };

  const extractIngredients = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result?.toString().split(',')[1];
          
          const response = await axios.post(
            'https://api-inference.huggingface.co/models/microsoft/git-base',
            { inputs: base64Image },
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              timeout: 30000, // 30 second timeout
            }
          );

          if (!response.data || !response.data[0]?.generated_text) {
            throw new Error('Invalid response from API');
          }

          // Process the response to extract ingredients
          const description = response.data[0].generated_text.toLowerCase();
          
          // Split on common delimiters and handle multi-word ingredients
          const phrases = description
            .replace(/[,.](?=[a-z])/g, ' ') // Replace commas and periods with spaces if followed by letter
            .split(/[,.\n]+/) // Split on remaining punctuation and newlines
            .flatMap(phrase => phrase.trim().split(/\s+/)); // Split each phrase into words
          
          // Filter and clean ingredients
          const extractedIngredients = phrases
            .filter(isLikelyIngredient)
            .map(ingredient => ingredient.toLowerCase().trim());

          // Remove duplicates and sort
          const uniqueIngredients = [...new Set(extractedIngredients)].sort();
          
          onIngredientsExtracted(uniqueIngredients);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
              setError('Invalid API key. Please check your Hugging Face API key.');
            } else if (err.code === 'ECONNABORTED') {
              setError('Request timed out. Please try again.');
            } else if (!err.response) {
              setError('Network error. Please check your internet connection.');
            } else {
              setError(`API Error: ${err.response.data?.error || 'Unknown error occurred'}`);
            }
          } else {
            setError('Failed to process the image. Please try again.');
          }
          console.error('Error:', err);
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read the image file. Please try again.');
        setLoading(false);
      };
    } catch (err) {
      setError('Failed to process the image. Please try again.');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upload Food Image</h3>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50">
              <Upload className="h-5 w-5" />
              <span>Choose Image</span>
            </div>
          </label>
          <Button
            onClick={extractIngredients}
            disabled={!selectedImage || loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Extract Ingredients'
            )}
          </Button>
        </div>
      </div>

      {imagePreview && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};  

export default ImageUpload;