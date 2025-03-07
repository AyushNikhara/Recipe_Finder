import React from 'react';
import { Check } from 'lucide-react';

const DIETARY_PREFERENCES = [
  { id: 'vegetarian', label: 'Vegetarian', value: 'vegetarian' },
  { id: 'vegan', label: 'Vegan', value: 'vegan' },
  { id: 'gluten-free', label: 'Gluten Free', value: 'gluten-free' },
  { id: 'dairy-free', label: 'Dairy Free', value: 'dairy-free' },
  { id: 'keto', label: 'Keto', value: 'keto' },
  { id: 'paleo', label: 'Paleo', value: 'paleo' },
];
 
interface DietaryPreferencesProps {
  selected: string[];
  onChange: (preferences: string[]) => void;
}

const DietaryPreferences: React.FC<DietaryPreferencesProps> = ({ selected, onChange }) => {
  const togglePreference = (value: string) => {
    const newPreferences = selected.includes(value)
      ? selected.filter((p) => p !== value)
      : [...selected, value];
    onChange(newPreferences);
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {DIETARY_PREFERENCES.map((preference) => (
        <button
          key={preference.id}
          onClick={() => togglePreference(preference.value)}
          className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
            selected.includes(preference.value)
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="text-sm font-medium">{preference.label}</span>
          {selected.includes(preference.value) && (
            <Check className="h-5 w-5 text-blue-500" />
          )}
        </button>
      ))}
    </div>
  );
};

export default DietaryPreferences;