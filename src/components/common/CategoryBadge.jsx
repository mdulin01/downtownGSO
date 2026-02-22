const categoryColors = {
  // Post categories
  'What I Love': 'bg-pink-900 text-pink-200',
  'Opportunity': 'bg-green-900 text-green-200',
  'Event': 'bg-purple-900 text-purple-200',
  'Business Spotlight': 'bg-amber-900 text-amber-200',

  // Suggestion categories
  'Walkability': 'bg-blue-900 text-blue-200',
  'Bike Infrastructure': 'bg-cyan-900 text-cyan-200',
  'Green Space': 'bg-emerald-900 text-emerald-200',
  'Lighting & Safety': 'bg-orange-900 text-orange-200',
  'Transit': 'bg-indigo-900 text-indigo-200',
  'Streetscape': 'bg-slate-700 text-slate-200',
  'Public Art': 'bg-rose-900 text-rose-200',
  'Wayfinding': 'bg-teal-900 text-teal-200',
  'Buildings & Facades': 'bg-stone-700 text-stone-200',
  'Public Spaces': 'bg-lime-900 text-lime-200',

  // Business categories
  'Restaurants': 'bg-red-900 text-red-200',
  'Bars & Breweries': 'bg-amber-900 text-amber-200',
  'Coffee & Cafes': 'bg-yellow-900 text-yellow-200',
  'Retail': 'bg-pink-900 text-pink-200',
  'Services': 'bg-gray-700 text-gray-200',
  'Arts & Culture': 'bg-fuchsia-900 text-fuchsia-200',
  'Entertainment': 'bg-violet-900 text-violet-200',
  'Fitness & Wellness': 'bg-teal-900 text-teal-200',

  // Impact/Status badges
  'Quick Win': 'bg-green-900 text-green-200',
  'Medium-Term': 'bg-amber-900 text-amber-200',
  'Long-Term': 'bg-blue-900 text-blue-200',
  'New': 'bg-cyan-900 text-cyan-200',
  'Under Discussion': 'bg-indigo-900 text-indigo-200',
  'In Progress': 'bg-purple-900 text-purple-200',
  'Completed': 'bg-green-900 text-green-200'
};

export default function CategoryBadge({ category, size = 'md' }) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const colorClass = categoryColors[category] || 'bg-slate-700 text-slate-200';

  return (
    <span className={`inline-block rounded-full font-medium ${sizeClasses[size]} ${colorClass}`}>
      {category}
    </span>
  );
}
