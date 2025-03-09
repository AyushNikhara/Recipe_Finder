import React from 'react';
import { Check } from 'lucide-react'; // Importing Check icon from lucide-react for UI indication

// List of dietary preferences with unique IDs, labels, and values
const DIETARY_PREFERENCES = [
  { id: 'vegetarian', label: 'Vegetarian', value: 'vegetarian' },
  { id: 'vegan', label: 'Vegan', value: 'vegan' },
  { id: 'gluten-free', label: 'Gluten Free', value: 'gluten-free' },
  { id: 'dairy-free', label: 'Dairy Free', value: 'dairy-free' },
  { id: 'keto', label: 'Keto', value: 'keto' },
  { id: 'paleo', label: 'Paleo', value: 'paleo' },
];
 
// Define the props interface
interface DietaryPreferencesProps {
  selected: string[]; // Array of selected dietary preferences
  onChange: (preferences: string[]) => void; // Function to update selected preferences
}

const DietaryPreferences: React.FC<DietaryPreferencesProps> = ({ selected, onChange }) => {
  // Function to toggle the selected state of a dietary preference
  const togglePreference = (value: string) => {
    const newPreferences = selected.includes(value)
      ? selected.filter((p) => p !== value) // Remove if already selected
      : [...selected, value]; // Add if not selected
    onChange(newPreferences); // Update parent component state
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {/* Loop through dietary preferences and create buttons */}
      {DIETARY_PREFERENCES.map((preference) => (
        <button
          key={preference.id} // Unique key for React rendering
          onClick={() => togglePreference(preference.value)} // Handle selection toggle
          className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
            selected.includes(preference.value)
              ? 'border-blue-500 bg-blue-50' // Apply blue styling if selected
              : 'border-gray-200 hover:border-gray-300' // Default styling
          }`}
        >
          <span className="text-sm font-medium">{preference.label}</span>
          {selected.includes(preference.value) && (
            <Check className="h-5 w-5 text-blue-500" /> // Show check icon if selected
          )}
        </button>
      ))}
    </div>
  );
};

export default DietaryPreferences;
