import { INTEREST_CATEGORIES } from '../../constants';
import { Check } from 'lucide-react';

const INTEREST_ICONS = {
  'Parks & Green Spaces': '🌳',
  'Live Music & Nightlife': '🎵',
  'Dining & Restaurants': '🍽️',
  'Arts & Culture': '🎨',
  'Shopping & Retail': '🛍️',
  'Fitness & Wellness': '💪',
  'Community Events': '🎉',
  'Coffee & Cafes': '☕',
  'Bars & Breweries': '🍺'
};

export default function InterestsSelector({ selected = [], onChange, customText = '', onCustomChange }) {
  const toggle = (interest) => {
    if (selected.includes(interest)) {
      onChange(selected.filter(i => i !== interest));
    } else {
      onChange([...selected, interest]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {INTEREST_CATEGORIES.map((interest) => {
          const isSelected = selected.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggle(interest)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition border ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              <span>{INTEREST_ICONS[interest] || '📌'}</span>
              <span className="flex-1 text-left text-xs">{interest}</span>
              {isSelected && <Check size={14} className="text-emerald-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {onCustomChange !== undefined && (
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Anything else you're into?</label>
          <input
            type="text"
            value={customText}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="e.g., yoga, book clubs, urban gardening..."
            maxLength={200}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      )}
    </div>
  );
}
