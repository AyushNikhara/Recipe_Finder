import { ingredientsData, flattenedExcludeWords } from './ingredients';

// Create a Map of normalized ingredient names to their original form
const ingredientMap = new Map(
  Object.values(ingredientsData)
    .flat()
    .map(ingredient => [ingredient.toLowerCase(), ingredient])
);

export function filterIngredients(text: string): string[] {
  // Convert text to lowercase for consistent matching
  const lowercaseText = text.toLowerCase();
  
  // Remove punctuation and split into words
  const words = lowercaseText
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1);

  // Create pairs of consecutive words for compound ingredients
  const wordPairs = words.map((word, i) => 
    i < words.length - 1 ? `${word} ${words[i + 1]}` : word
  );

  // Combine single words and pairs for checking
  const potentialIngredients = [...words, ...wordPairs];

  // Filter and normalize ingredients
  const foundIngredients = new Set<string>();

  for (const word of potentialIngredients) {
    // Skip common words
    if (flattenedExcludeWords.includes(word)) continue;

    // Check if it's a known ingredient
    const normalizedWord = word.toLowerCase();
    if (ingredientMap.has(normalizedWord)) {
      foundIngredients.add(ingredientMap.get(normalizedWord)!);
    }
  }

  // Convert to array, remove duplicates, and sort
  return Array.from(foundIngredients).sort();
}