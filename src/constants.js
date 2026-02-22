export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export const DOWNTOWN_CENTER = [-79.7920, 36.0726];
export const DOWNTOWN_BOUNDS = [[-79.815, 36.055], [-79.770, 36.090]];

export const POST_CATEGORIES = [
  'What I Love',
  'Opportunity',
  'Event',
  'Business Spotlight'
];

export const SUGGESTION_CATEGORIES = [
  'Walkability',
  'Bike Infrastructure',
  'Green Space',
  'Lighting & Safety',
  'Transit',
  'Streetscape',
  'Public Art',
  'Wayfinding',
  'Buildings & Facades',
  'Public Spaces'
];

export const BUSINESS_CATEGORIES = [
  'Restaurants',
  'Bars & Breweries',
  'Coffee & Cafes',
  'Retail',
  'Services',
  'Arts & Culture',
  'Entertainment',
  'Fitness & Wellness'
];

export const SUGGESTION_IMPACT = [
  'Quick Win',
  'Medium-Term',
  'Long-Term'
];

export const SUGGESTION_STATUS = [
  'New',
  'Under Discussion',
  'In Progress',
  'Completed'
];
