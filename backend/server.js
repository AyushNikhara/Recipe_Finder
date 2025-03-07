import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Recipe } from './models/Recipe.js';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_DB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/recipes', async (req, res) => {
  try {
    const { ingredients, dietaryPreferences, timeFilter, difficultyFilter, cuisineFilter, ratingFilter } = req.query;

    let query = {};

    // Filter by ingredients if provided
    if (ingredients) {
      const ingredientList = ingredients.split(',').map(i => i.trim().toLowerCase());
      query.ingredients = { 
        $in: ingredientList.map(ingredient => 
          new RegExp(ingredient, 'i')
        ) 
      };
    }

    // Filter by dietary preferences
    if (dietaryPreferences) {
      const preferences = dietaryPreferences.split(',').map(p => p.trim());
      query.dietaryRestrictions = { $all: preferences };
    }

    // Filter by cooking time
    if (timeFilter && timeFilter !== 'all') {
      const time = parseInt(timeFilter.replace('under', ''));
      query.cookingTime = { $lt: time };
    }

    // Filter by difficulty
    if (difficultyFilter && difficultyFilter !== 'all') {
      query.difficulty = difficultyFilter;
    }

    // Filter by cuisine
    if (cuisineFilter && cuisineFilter !== 'all') {
      query.cuisine = { $regex: new RegExp(cuisineFilter, 'i') };
    }

    // Filter by rating
    if (ratingFilter) {
      query.rating = { $gte: parseFloat(ratingFilter) };
    }

    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});


app.post('/api/recipes/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const recipe = await Recipe.findOne({ id: id });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const review = {
      id: new mongoose.Types.ObjectId().toString(),
      userId: 'current-user',
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    recipe.reviews.push(review);
    
    // Calculate new average rating
    const totalRatings = recipe.reviews.length;
    recipe.rating = recipe.reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
    
    await recipe.save();
    res.json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// To Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});