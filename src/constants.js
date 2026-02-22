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
// Traced from confirmed Google Maps intersection coordinates
// East: Murrow Blvd | South: Carolyn Coleman Way | West: Freeman Mill Rd/railroad | North: Smith/Eugene/Fisher
export const GREENWAY_PATH = [
  // Start at NE corner: Murrow Blvd & Fisher Ave
  [-79.7874, 36.0793],  // Murrow & Fisher Ave (NE start)

  // EAST LEG - South on Murrow Blvd
  [-79.7868, 36.0778],  // Murrow south of Fisher
  [-79.7860, 36.0762],  // Murrow near Lindsay St
  [-79.7850, 36.0745],  // Murrow between Lindsay & Friendly
  [-79.7835, 36.0730],  // Murrow & Friendly Ave
  [-79.7835, 36.0721],  // Murrow & Market St
  [-79.7838, 36.0705],  // Murrow south of Market
  [-79.7840, 36.0690],  // Murrow near Sycamore
  [-79.7842, 36.0675],  // Murrow near Washington St
  [-79.7846, 36.0649],  // Murrow & Gate City Blvd

  // SOUTH LEG - SW along Carolyn Coleman Way to Freeman Mill
  [-79.7855, 36.0642],  // trail leaves Murrow heading SW
  [-79.7870, 36.0635],  // approaching Carolyn Coleman Way
  [-79.7886, 36.0630],  // Carolyn Coleman Way
  [-79.7910, 36.0630],  // Carolyn Coleman heading west
  [-79.7935, 36.0632],  // continuing west
  [-79.7960, 36.0636],  // approaching Freeman Mill
  [-79.7996, 36.0641],  // Freeman Mill & Gate City Blvd

  // WEST LEG - North along Freeman Mill Rd / railroad corridor
  [-79.7985, 36.0660],  // Freeman Mill heading north
  [-79.7975, 36.0689],  // Freeman Mill & Spring St
  [-79.7980, 36.0700],  // railroad corridor north of Spring Garden
  [-79.7991, 36.0710],  // College Bridge Way
  [-79.7990, 36.0725],  // railroad corridor continuing north
  [-79.7985, 36.0740],  // north along tracks
  [-79.7978, 36.0755],  // approaching W Friendly area
  [-79.7968, 36.0768],  // nearing Smith St

  // NORTH LEG - East along Smith St / Eugene St / Fisher Ave / Murrow curve
  [-79.7955, 36.0778],  // Smith St west of Eugene
  [-79.7937, 36.0783],  // N Eugene & W Smith St
  [-79.7936, 36.0793],  // N Eugene heading north to Fisher
  [-79.7936, 36.0800],  // N Eugene & W Fisher Ave
  [-79.7920, 36.0802],  // Fisher Ave heading east
  [-79.7905, 36.0804],  // Fisher approaching Murrow curve
  [-79.7892, 36.0805],  // Murrow Blvd curve (north apex)
  [-79.7882, 36.0803],  // Murrow curving southeast
  [-79.7876, 36.0799],  // Murrow continuing to curve
  [-79.7874, 36.0793]   // close loop at Murrow & Fisher
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
