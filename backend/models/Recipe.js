import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: String,
  userId: String,
  rating: Number,
  comment: String,
  createdAt: String
});

// 

const recipeSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Keep the string ID for frontend compatibility
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [String],
  instructions: [String],
  cookingTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  dietaryRestrictions: [String],
  cuisine: { type: String, required: true },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  imageUrl: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: [reviewSchema]
}, {
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret.id || ret._id; // Ensure id is always available
      delete ret._id; // Remove _id from the output
      delete ret.__v; // Remove version key
      return ret;
    }
  }
});

export const Recipe = mongoose.model('Recipe', recipeSchema);