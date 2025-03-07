import { z } from 'zod';
import { WordTokenizer } from 'natural';
import { validIngredients } from './validIngredients';

const tokenizer = new WordTokenizer();

// Schema for validating ingredients
const ingredientSchema = z.string().min(2).transform(str => str.toLowerCase().trim());

// Common words to filter out
const commonWords = new Set([
  'the', 'and', 'or', 'with', 'in', 'on', 'at', 'to', 'for', 'of', 'a', 'an',
  'some', 'few', 'many', 'much', 'this', 'that', 'these', 'those', 'image',
  'picture', 'photo', 'shows', 'showing', 'contains', 'containing', 'dish',
  'food', 'meal', 'recipe', 'ingredients', 'cooking', 'cooked', 'prepared',
  'made', 'served', 'plate', 'bowl', 'cup', 'pieces', 'slices', 'chunks'
]);

// Common measurements to filter out
const measurements = new Set([
  'cup', 'cups', 'tablespoon', 'tablespoons', 'tbsp', 'teaspoon', 'teaspoons',
  'tsp', 'gram', 'grams', 'g', 'kilogram', 'kg', 'pound', 'pounds', 'lb',
  'lbs', 'ounce', 'ounces', 'oz', 'ml', 'liter', 'liters', 'l', 'pinch',
  'dash', 'handful', 'piece', 'pieces', 'slice', 'slices'
]);

// Regex patterns
const numberPattern = /^\d+(\.\d+)?$/;
const quantityPattern = /^(\d+\/\d+|\d+(\.\d+)?)(oz|g|kg|lb|lbs|cup|tbsp|tsp|ml|l)s?$/i;
const cleanTextPattern = /[^\w\s-]/g;

// Clean and normalize text
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(cleanTextPattern, ' ')
    .trim();
}

// Check if a word is likely an ingredient
function isLikelyIngredient(word: string): boolean {
  const cleaned = cleanText(word);
  return validIngredients.includes(cleaned as any);
}

// Process text through NLP pipeline
function processTextNLP(text: string): string[] {
  const tokens = tokenizer.tokenize(text);
  if (!tokens) return [];
  
  return tokens.filter(token => {
    const cleaned = cleanText(token);
    return (
      cleaned.length > 1 &&
      !commonWords.has(cleaned) &&
      !measurements.has(cleaned) &&
      isLikelyIngredient(cleaned)
    );
  });
}

export function filterIngredients(rawText: string | string[]): string[] {
  const text = Array.isArray(rawText) ? rawText.join(' ') : rawText;
  const filteredSet = new Set<string>();

  // First pass: NLP processing
  const nlpResults = processTextNLP(text);

  // Second pass: Validation and cleaning
  for (const word of nlpResults) {
    // Skip numbers and measurements
    if (
      numberPattern.test(word) ||
      quantityPattern.test(word) ||
      commonWords.has(word) ||
      measurements.has(word)
    ) {
      continue;
    }

    try {
      // Validate and clean the ingredient
      const validIngredient = ingredientSchema.parse(word);
      
      // Final check against whitelist
      if (validIngredient && validIngredients.includes(validIngredient as any)) {
        filteredSet.add(validIngredient);
      }
    } catch {
      // Skip invalid ingredients
      continue;
    }
  }

  return Array.from(filteredSet);
}