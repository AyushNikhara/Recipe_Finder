import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import axios from 'axios';
import Button from './ui/Button';
import { filterIngredients } from '../utils/ingredientFilter';

interface ImageUploadProps {
  onIngredientsExtracted: (ingredients: string[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onIngredientsExtracted }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size should be less than 10MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
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

      const readerPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64Image = reader.result?.toString().split(',')[1];
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

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/microsoft/git-base',
        { inputs: base64Image },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      if (!response.data?.[0]?.generated_text) {
        throw new Error('Invalid response from Hugging Face API');
      }

      const description = response.data[0].generated_text;
      console.log('Raw text from image:', description);

      const extractedIngredients = filterIngredients(description);
      console.log('Filtered ingredients:', extractedIngredients);

      if (extractedIngredients.length === 0) {
        throw new Error('No ingredients found in the image');
      }

      onIngredientsExtracted(extractedIngredients);
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
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = err.response.data?.error || 'API error occurred';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error('Error:', errorMessage);
    } finally {
      setLoading(false);
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
        <>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
        </>
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