export const ingredientsData = {
    vegetables: [
        "Carrot", "Broccoli", "Spinach", "Potato", "Tomato", "Onion", "Garlic", "Pepper",
        "Cucumber", "Lettuce", "Mushroom", "Cauliflower", "Cabbage", "Zucchini", "Eggplant",
        "Pumpkin", "Radish", "Sweet Potato", "Beetroot", "Asparagus", "Brussels Sprouts",
        "Celery", "Kale", "Leeks", "Okra", "Turnip", "Parsnip", "Artichoke", "Arugula",
        "Swiss Chard", "Watercress", "Bok Choy", "Chayote", "Fennel Bulb", "Horseradish",
        "Kohlrabi", "Microgreens", "Seaweed", "Sprouts", "Bell Pepper", "Red Onion"
    ],
    fruits: [
        "Apple", "Apples","Banana", "Bananas" , "Orange", "Grapes", "Mango", "Strawberry", "Pineapple",
        "Watermelon", "Papaya", "Kiwi", "Blueberry", "Raspberry", "Cherry", "Pomegranate",
        "Peach", "Pear", "Plum", "Fig", "Coconut", "Avocado", "Blackberry", "Cranberry",
        "Guava", "Jackfruit", "Lychee", "Nectarine", "Persimmon", "Starfruit", "Tamarind",
        "Mulberry", "Passion Fruit", "Cantaloupe", "Honeydew Melon", "Dragon Fruit",
        "Date", "Gooseberry", "Soursop", "Jujube", "Rambutan", "Sapodilla", "Lemon"
    ],
    grains_starches: [
        "Rice", "Wheat", "Oats", "Barley", "Quinoa", "Corn", "Millet", "Rye", "Sorghum",
        "Pasta", "Bread", "Flour", "Noodles", "Couscous", "Polenta", "Buckwheat", "Spelt",
        "Teff", "Farro", "Amaranth", "Brown Rice", "Wild Rice", "Freekeh", "Tapioca",
        "Vermicelli", "Semolina", "Soba Noodles", "Rice Paper", "Tortilla", "Pizza Dough",
        "Egg Noodles", "Spaghetti", "Fettuccine Pasta"
    ],
    dairy_alternatives: [
        "Milk", "Cheese", "Yogurt", "Butter", "Cream", "Cottage Cheese", "Ghee",
        "Almond Milk", "Soy Milk", "Coconut Milk", "Oat Milk", "Cashew Milk",
        "Goat Cheese", "Sheep Milk", "Ricotta", "Feta Cheese", "Mozzarella Cheese",
        "Parmesan Cheese", "Provolone", "Camembert", "Brie", "Buttermilk",
        "Lactose-Free Milk", "Kefir", "Greek Yogurt", "Heavy Cream", "Sour Cream"
    ],
    meat_seafood: [
        "Chicken", "Beef", "Pork", "Lamb", "Turkey", "Duck", "Fish", "Shrimp", "Crab",
        "Lobster", "Salmon", "Tuna", "Octopus", "Squid", "Goat Meat", "Mackerel",
        "Anchovy", "Sardines", "Eel", "Trout", "Venison", "Bison", "Rabbit", "Quail",
        "Goose", "Frog Legs", "Snails", "Clams", "Mussels", "Oysters", "Scallops",
        "Chicken Breast", "Ground Beef", "Beef Strips", "Salmon Fillet", "Pancetta"
    ],
    herbs_spices: [
        "Salt", "Pepper", "Cumin", "Coriander", "Turmeric", "Cinnamon", "Clove",
        "Nutmeg", "Cardamom", "Paprika", "Oregano", "Basil", "Rosemary", "Thyme",
        "Bay Leaf", "Mustard Seeds", "Fenugreek", "Ginger", "Garlic Powder",
        "Chili Powder", "Saffron", "Dill", "Parsley", "Cilantro", "Fennel",
        "Marjoram", "Tarragon", "Turmeric Root", "Galangal", "Lemongrass",
        "Curry Leaves", "Chervil", "Sorrel", "Wasabi", "Cajun Spice", "Za'atar",
        "Five-Spice Powder", "Sumac", "Anise", "Ajwain", "Black Sesame Seeds",
        "White Sesame Seeds", "Celery Seeds", "Sage", "Savory", "Fresh Basil",
        "Black Pepper"
    ],
    pantry_items: [
        "Olive Oil", "Vegetable Oil", "Vinegar", "Soy Sauce", "Honey", "Sugar",
        "Salt", "Pepper", "Baking Powder", "Baking Soda", "Cornstarch", "Yeast",
        "Cocoa Powder", "Vanilla Extract", "Maple Syrup", "Tomato Paste", "Mustard",
        "Ketchup", "Mayonnaise", "Peanut Butter", "Jam", "Chili Sauce", "Sesame Oil",
        "Fish Sauce", "Coconut Oil", "Molasses", "Agave Syrup", "Tahini", "Miso Paste",
        "Hoisin Sauce", "Mirin", "Rice Vinegar", "Coconut Sugar", "Brown Sugar",
        "Panko Breadcrumbs", "Pecans", "Almonds", "Cashews", "Walnuts",
        "Macadamia Nuts", "Hazelnuts", "Sunflower Seeds", "Pumpkin Seeds",
        "Breadcrumbs", "Beef Broth", "Vegetable Broth", "White Wine", "Lemon Juice"
    ]
};

// Words to exclude from ingredient detection
export const excludeWords = {
    // Common words
    common: [
        'the', 'and', 'or', 'with', 'in', 'on', 'at', 'to', 'for', 'of', 'a', 'an',
        'some', 'few', 'many', 'much', 'this', 'that', 'these', 'those'
    ],

    // Food-related but not ingredients
    foodRelated: [
        'food', 'dish', 'meal', 'recipe', 'cuisine', 'ingredients', 'dinner', 'lunch',
        'breakfast', 'snack', 'appetizer', 'dessert'
    ],

    // Cooking terms
    cookingTerms: [
        'cook', 'bake', 'fry', 'grill', 'roast', 'steam', 'boil', 'simmer', 'prepare',
        'mix', 'blend', 'chop', 'slice', 'dice', 'mince'
    ],

    // Measurements
    measurements: [
        'cup', 'cups', 'tablespoon', 'tablespoons', 'teaspoon', 'teaspoons',
        'gram', 'grams', 'kilogram', 'kilograms', 'pound', 'pounds', 'ounce', 'ounces',
        'ml', 'liter', 'liters'
    ],

    // Descriptors
    descriptors: [
        'fresh', 'dried', 'frozen', 'canned', 'raw', 'cooked', 'hot', 'cold', 'warm',
        'sweet', 'sour', 'salty', 'bitter', 'spicy'
    ],

    // Image-related
    imageRelated: [
        'image', 'picture', 'photo', 'shows', 'showing', 'contains', 'containing'
    ]
};

// Flatten exclude words for easy lookup
export const flattenedExcludeWords = Object.values(excludeWords).flat();