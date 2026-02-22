export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export const DOWNTOWN_CENTER = [-79.7910, 36.0726];
export const DOWNTOWN_BOUNDS = [[-79.810, 36.058], [-79.773, 36.086]];

// Downtown Greensboro core business district polygon [lng, lat]
// Roughly: Market St (north), Davie/Church (east), Lee/Gate City (south), Greene/Edgeworth (west)
export const DOWNTOWN_BOUNDARY = [
  [-79.7975, 36.0680],  // SW corner - Greene & Lee St area
  [-79.7960, 36.0670],
  [-79.7920, 36.0665],  // S Elm & Lee St
  [-79.7880, 36.0668],
  [-79.7845, 36.0672],  // SE corner - Davie & Lee area
  [-79.7830, 36.0685],
  [-79.7825, 36.0710],  // E side - Church/Davie St
  [-79.7825, 36.0740],
  [-79.7828, 36.0760],
  [-79.7835, 36.0778],  // NE corner - Elm/Market/Lindsay
  [-79.7855, 36.0790],
  [-79.7880, 36.0795],
  [-79.7910, 36.0798],  // N Elm & Market
  [-79.7940, 36.0795],
  [-79.7965, 36.0788],  // NW corner - Greene/Market area
  [-79.7980, 36.0775],
  [-79.7988, 36.0755],
  [-79.7992, 36.0730],  // W side - Greene/Edgeworth
  [-79.7990, 36.0705],
  [-79.7982, 36.0688],
  [-79.7975, 36.0680]   // close loop
];

// Downtown Greenway trail path [lng, lat] - 4-mile loop
// Phase 1: Southern Trace (railroad corridor / Bragg St / Carolyn Coleman Way)
// Phase 2: Eastern Way (Murrow Blvd, south to north)
// Phase 3: Northern Passage (Lindsay/Smith St, Fisher Park area)
// Phase 4: Western Branch (western railroad corridor)
export const GREENWAY_PATH = [
  // Start at Five Points area (SE, Phase 1/2 junction)
  [-79.7815, 36.0648],  // Five Points / Eugene & Bragg
  // Phase 2: Eastern Way - north along Murrow Blvd
  [-79.7808, 36.0665],
  [-79.7800, 36.0685],
  [-79.7795, 36.0705],  // Murrow & E Market St
  [-79.7792, 36.0725],
  [-79.7790, 36.0745],
  [-79.7788, 36.0762],
  [-79.7790, 36.0778],  // Murrow near Lindsay
  [-79.7795, 36.0795],
  [-79.7800, 36.0808],  // Murrow & Fisher Ave
  // Phase 3: Northern Passage - west along Smith/Lindsay/Fisher Park
  [-79.7812, 36.0818],
  [-79.7830, 36.0825],
  [-79.7850, 36.0828],  // near N Elm & Lindsay
  [-79.7870, 36.0830],
  [-79.7890, 36.0830],
  [-79.7910, 36.0828],  // N Elm & Smith area
  [-79.7930, 36.0825],
  [-79.7950, 36.0820],
  [-79.7968, 36.0812],  // near Spring & Friendly
  [-79.7982, 36.0800],
  // Phase 4: Western Branch - south along western rail corridor
  [-79.7992, 36.0785],
  [-79.8000, 36.0768],
  [-79.8005, 36.0748],
  [-79.8008, 36.0728],  // near Spring Garden & railroad
  [-79.8008, 36.0708],
  [-79.8005, 36.0690],
  [-79.8000, 36.0672],  // SW area near railroad
  [-79.7990, 36.0658],
  [-79.7975, 36.0648],  // Morehead Park / Spring Garden area
  // Phase 1: Southern Trace - east along Bragg/railroad
  [-79.7955, 36.0642],
  [-79.7935, 36.0638],
  [-79.7915, 36.0636],  // S Elm & rail crossing
  [-79.7895, 36.0636],
  [-79.7875, 36.0638],
  [-79.7855, 36.0640],
  [-79.7835, 36.0643],  // Bragg St area
  [-79.7815, 36.0648]   // close loop at Five Points
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
