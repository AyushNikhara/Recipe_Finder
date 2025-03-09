import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react'; // Importing icons for UI elements
import axios from 'axios'; // Axios for making HTTP requests
import Button from './ui/Button'; // Custom Button component
import { filterIngredients } from '../utils/ingredientFilter'; // Utility function to filter ingredients

// Define props interface
interface ImageUploadProps {
  onIngredientsExtracted: (ingredients: string[]) => void; // Callback function to return extracted ingredients
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onIngredientsExtracted }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State for storing selected image
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for previewing image
  const [loading, setLoading] = useState(false); // State to manage loading state during API call
  const [error, setError] = useState<string | null>(null); // State to store error messages

  // Function to handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first selected file
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB file size limit
        setError('Image size should be less than 10MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL for selected image
      setError(null);
    }
  };

  // Function to process image and extract ingredients
  const extractIngredients = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader(); // FileReader to convert image to base64
      
      const readerPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64Image = reader.result?.toString().split(',')[1]; // Extract base64 data from result
          if (base64Image) {
            resolve(base64Image);
          } else {
            reject(new Error('Failed to process image'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(selectedImage);
      });

      const base64Image = await readerPromise;

      // API call to Hugging Face model for image processing
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/microsoft/git-base',
        { inputs: base64Image },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // Set timeout for API call
        }
      );

      if (!response.data?.[0]?.generated_text) {
        throw new Error('Invalid response from Hugging Face API');
      }

      const description = response.data[0].generated_text;
      console.log('Raw text from image:', description);

      const extractedIngredients = filterIngredients(description); // Extract ingredients from text
      console.log('Filtered ingredients:', extractedIngredients);

      if (extractedIngredients.length === 0) {
        throw new Error('No ingredients found in the image');
      }

      onIngredientsExtracted(extractedIngredients); // Pass extracted ingredients to parent component
      setSelectedImage(null);
      setImagePreview(null);
    } catch (err) {
      let errorMessage = 'Failed to process the image';

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorMessage = 'Invalid API key. Please check your API keys.';
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (!err.response) {
          errorMessage = 'Network error. Refresh The Website.';
        } else {
          errorMessage = err.response.data?.error || 'API error occurred';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error('Error:', errorMessage);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Upload Ingredient Image</h3>
          <p className="text-sm text-gray-500">Please upload one ingredient image at a time for best results</p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange} // Handle image selection
            />
            <div className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50">
              <Upload className="h-5 w-5" />
              <span>Choose Image</span>
            </div>
          </label>
          <Button
            onClick={extractIngredients}
            disabled={!selectedImage || loading} // Disable button if no image or loading
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

      {/* Display image preview if available */}
      {imagePreview !== null && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Display error messages if any */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
