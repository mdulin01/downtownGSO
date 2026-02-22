export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export const DOWNTOWN_CENTER = [-79.7920, 36.0726];
export const DOWNTOWN_BOUNDS = [[-79.815, 36.055], [-79.770, 36.090]];

// Downtown Greensboro boundary polygon [lng, lat]
export const DOWNTOWN_BOUNDARY = [
  [-79.8050, 36.0580],
  [-79.7950, 36.0580],
  [-79.7850, 36.0580],
  [-79.7780, 36.0590],
  [-79.7750, 36.0610],
  [-79.7740, 36.0650],
  [-79.7730, 36.0700],
  [-79.7730, 36.0750],
  [-79.7730, 36.0800],
  [-79.7740, 36.0850],
  [-79.7760, 36.0880],
  [-79.7800, 36.0900],
  [-79.7850, 36.0900],
  [-79.7920, 36.0900],
  [-79.7980, 36.0890],
  [-79.8020, 36.0870],
  [-79.8050, 36.0840],
  [-79.8070, 36.0800],
  [-79.8080, 36.0750],
  [-79.8080, 36.0700],
  [-79.8070, 36.0650],
  [-79.8060, 36.0610],
  [-79.8050, 36.0580]
];

// Downtown Greenway trail path [lng, lat] - approximate 4-mile loop
export const GREENWAY_PATH = [
  [-79.8040, 36.0590],
  [-79.8000, 36.0585],
  [-79.7950, 36.0580],
  [-79.7900, 36.0578],
  [-79.7850, 36.0580],
  [-79.7800, 36.0585],
  [-79.7760, 36.0600],
  [-79.7745, 36.0630],
  [-79.7738, 36.0670],
  [-79.7735, 36.0720],
  [-79.7733, 36.0770],
  [-79.7735, 36.0820],
  [-79.7745, 36.0860],
  [-79.7770, 36.0885],
  [-79.7810, 36.0895],
  [-79.7860, 36.0898],
  [-79.7920, 36.0895],
  [-79.7970, 36.0888],
  [-79.8010, 36.0870],
  [-79.8040, 36.0840],
  [-79.8060, 36.0800],
  [-79.8068, 36.0750],
  [-79.8070, 36.0700],
  [-79.8065, 36.0650],
  [-79.8050, 36.0610],
  [-79.8040, 36.0590]
];

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
