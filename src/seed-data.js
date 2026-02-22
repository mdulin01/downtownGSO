// Downtown Greensboro, NC Seed Data
// Real businesses, infrastructure suggestions, and sample events for the downtown area

// Businesses in Downtown Greensboro
export const seedBusinesses = [
  // Restaurants
  {
    name: "Natty Greene's Pub & Brewing Co.",
    category: "restaurants",
    address: "345 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0702, lng: -79.7920 },
    description: "Craft brewery and pub since 2004 featuring rotating craft beers and comfort food classics.",
    website: "https://nattygreenes.com/",
    hours: "Mon-Thu 11am-11pm, Fri-Sat 11am-12am, Sun 11am-10pm",
    featured: true
  },
  {
    name: "White and Wood",
    category: "restaurants",
    address: "215 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0705, lng: -79.7918 },
    description: "Contemporary American cuisine with an emphasis on fresh, local ingredients.",
    website: "https://thewhiteandwood.com/",
    hours: "Tue-Thu 5pm-10pm, Fri-Sat 5pm-11pm, Sun 5pm-9pm",
    featured: true
  },
  {
    name: "Inka Grill",
    category: "restaurants",
    address: "214 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0705, lng: -79.7918 },
    description: "Peruvian restaurant specializing in ceviches, tiraditos, and traditional Andean dishes.",
    website: "https://inkagrill-greensboro.com/",
    hours: "Tue-Thu 5pm-10pm, Fri-Sat 5pm-11pm, Sun 5pm-9pm",
    featured: true
  },
  {
    name: "Undercurrent Restaurant",
    category: "restaurants",
    address: "327 Battleground Ave, Greensboro, NC 27401",
    location: { lat: 36.0695, lng: -79.7900 },
    description: "Farm-to-table restaurant featuring seasonal menus with locally sourced ingredients.",
    website: "https://www.undercurrentrestaurant.com/",
    hours: "Tue-Thu 5pm-10pm, Fri-Sat 5pm-11pm, Sun 5pm-9pm",
    featured: true
  },
  {
    name: "Chez Genèse",
    category: "restaurants",
    address: "122 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0715, lng: -79.7920 },
    description: "French-inspired brunch and dinner spot with classic European cuisine.",
    website: "https://www.chezgenese.com/",
    hours: "Mon-Fri 7am-3pm, Sat-Sun 8am-4pm",
    featured: false
  },
  {
    name: "Machete",
    category: "restaurants",
    address: "330 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0703, lng: -79.7920 },
    description: "Latin American restaurant with fresh seafood and seasonal preparations.",
    website: "https://machetegso.com/",
    hours: "Tue-Thu 5pm-10pm, Fri-Sat 5pm-11pm, Sun 5pm-9pm",
    featured: false
  },
  {
    name: "Jake's Diner",
    category: "restaurants",
    address: "611 S Elm St, Greensboro, NC 27406",
    location: { lat: 36.0680, lng: -79.7925 },
    description: "Classic American diner with comfort food favorites, breakfast, and sandwiches.",
    website: "https://jakes-diner-gso.com/",
    hours: "Mon-Fri 6am-9pm, Sat-Sun 7am-9pm",
    featured: false
  },
  {
    name: "Crafted - The Art of the Taco",
    category: "restaurants",
    address: "219 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0707, lng: -79.7918 },
    description: "Mexican street food with artisanal tacos, fresh salsas, and craft beverages.",
    website: "https://crafted-taco.com/",
    hours: "Mon-Thu 11am-10pm, Fri-Sat 11am-11pm, Sun 11am-9pm",
    featured: false
  },
  {
    name: "Stumble Stilskins",
    category: "restaurants",
    address: "202 W Market St, Greensboro, NC 27401",
    location: { lat: 36.0740, lng: -79.7940 },
    description: "Casual gastropub with creative cocktails, burgers, and lively atmosphere.",
    website: "https://stumblestilskins.com/",
    hours: "Mon-Fri 4pm-2am, Sat-Sun 11am-2am",
    featured: false
  },
  {
    name: "Jerusalem Market on Elm",
    category: "restaurants",
    address: "310 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0704, lng: -79.7920 },
    description: "Mediterranean market and casual dining with fresh Middle Eastern cuisine.",
    website: "http://www.jerusalemarket.com/on-elm/",
    hours: "Mon-Sat 10am-8pm, Sun 12pm-6pm",
    featured: false
  },
  {
    name: "Lewis & Elm",
    category: "bars",
    address: "627 S Elm St, Greensboro, NC 27406",
    location: { lat: 36.0679, lng: -79.7923 },
    description: "Wine bar and cheese shop with seasonal light fare and curated wine selection.",
    website: "https://lewisandelm.com/home",
    hours: "Tue-Thu 5pm-11pm, Fri-Sat 5pm-12am, Sun 5pm-10pm",
    featured: false
  },
  {
    name: "Cafe Europa",
    category: "bars",
    address: "310 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0704, lng: -79.7920 },
    description: "European-style café and bar with lunch, dinner, Sunday brunch, and full bar service.",
    website: "https://europagso.com/",
    hours: "Mon-Fri 11am-11pm, Sat-Sun 10am-11pm",
    featured: false
  },
  {
    name: "The Sage Mule",
    category: "bars",
    address: "220 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0706, lng: -79.7918 },
    description: "Cocktail bar specializing in craft drinks and craft spirits.",
    website: "https://www.thesagemule.com/",
    hours: "Tue-Thu 5pm-12am, Fri-Sat 5pm-1am, Sun 5pm-11pm",
    featured: false
  },
  {
    name: "Neighbors",
    category: "bars",
    address: "300 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0704, lng: -79.7920 },
    description: "Neighborhood bar with craft beers, food, and community-focused vibe.",
    website: "https://www.neighborsgso.com/",
    hours: "Mon-Fri 4pm-2am, Sat-Sun 12pm-2am",
    featured: false
  },
  {
    name: "Pryme",
    category: "bars",
    address: "235 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0706, lng: -79.7918 },
    description: "Prime steakhouse and cocktail bar with upscale atmosphere.",
    website: "https://www.prymegso.com/",
    hours: "Mon-Thu 5pm-10pm, Fri-Sat 5pm-11pm, Sun 5pm-9pm",
    featured: false
  },

  // Coffee Shops
  {
    name: "Common Grounds",
    category: "coffee",
    address: "631 S Elm St, Greensboro, NC 27406",
    location: { lat: 36.0677, lng: -79.7923 },
    description: "Specialty coffee shop with espresso drinks, pastries, and comfortable workspace.",
    website: "https://commongroundsgso.com/",
    hours: "Mon-Fri 6:30am-6pm, Sat-Sun 8am-5pm",
    featured: false
  },
  {
    name: "Awoo Coffee",
    category: "coffee",
    address: "236 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0706, lng: -79.7918 },
    description: "Cozy coffee shop known for specialty drinks and local pastries.",
    website: "https://awoocoffeegso.com/",
    hours: "Mon-Fri 7am-7pm, Sat-Sun 8am-6pm",
    featured: false
  },
  {
    name: "Union Coffee Co",
    category: "coffee",
    address: "216 W Friendly Ave, Greensboro, NC 27401",
    location: { lat: 36.0780, lng: -79.7960 },
    description: "Specialty café with third-wave coffee, catering, and community events.",
    website: "https://unioncoffeecogso.com/",
    hours: "Mon-Fri 6:30am-7pm, Sat 7am-6pm, Sun 8am-5pm",
    featured: false
  },
  {
    name: "Baked by Perrin Bakery & Café",
    category: "coffee",
    address: "227 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0706, lng: -79.7918 },
    description: "Artisan bakery with fresh pastries, coffee, and light lunch options.",
    website: "https://bakedbyperrin.com/",
    hours: "Mon-Fri 7am-6pm, Sat-Sun 8am-5pm",
    featured: false
  },
  {
    name: "Greensboro Coffee & Tea Collective",
    category: "coffee",
    address: "408 Wendover Ave, Greensboro, NC 27401",
    location: { lat: 36.0820, lng: -79.7850 },
    description: "Organic and fair-trade coffee shop with relaxed atmosphere.",
    website: "https://www.greensborocoffeeandtea.com/",
    hours: "Mon-Fri 7am-6pm, Sat-Sun 9am-5pm",
    featured: false
  },

  // Retail
  {
    name: "Just Be",
    category: "retail",
    address: "234 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0706, lng: -79.7918 },
    description: "Boutique specializing in U.S. made, fair trade, and handcrafted gifts and apparel.",
    website: "https://onlyjustbe.com/",
    hours: "Mon-Sat 10am-6pm, Sun 12pm-5pm",
    featured: false
  },
  {
    name: "Thousands O' Prints",
    category: "retail",
    address: "233 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0706, lng: -79.7918 },
    description: "Art print gallery and gift shop featuring local and regional artists.",
    website: "https://thousandsoprints.com/",
    hours: "Mon-Sat 10am-6pm, Sun 12pm-5pm",
    featured: false
  },
  {
    name: "Hometown Store",
    category: "retail",
    address: "603 S Elm St, Greensboro, NC 27406",
    location: { lat: 36.0681, lng: -79.7923 },
    description: "Curated selection of one-of-a-kind pieces and special collections.",
    website: "https://www.hometownstore.com/",
    hours: "Mon-Sat 10am-6pm, Sun 12pm-5pm",
    featured: false
  },
  {
    name: "Schiffman's Jewelers",
    category: "retail",
    address: "225 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0707, lng: -79.7918 },
    description: "Fine jewelry store with custom designs and repair services.",
    website: "https://www.schiffmansjewelers.com/",
    hours: "Mon-Sat 10am-5:30pm",
    featured: false
  },
  {
    name: "Little Poli's Playroom & Boutique",
    category: "retail",
    address: "227 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0706, lng: -79.7918 },
    description: "Children's boutique with toys, books, clothing, and accessories.",
    website: "https://www.littlepoliskids.com/",
    hours: "Mon-Sat 10am-6pm, Sun 12pm-5pm",
    featured: false
  },

  // Arts & Entertainment
  {
    name: "Elsewhere Museum",
    category: "arts",
    address: "606 S Elm St, Greensboro, NC 27406",
    location: { lat: 36.0681, lng: -79.7923 },
    description: "Immersive living art museum and artist residency in a historic thrift store building.",
    website: "https://www.elsewheremuseum.org/",
    hours: "Wed-Sat 12pm-5pm, Sun 1pm-5pm",
    featured: true
  },
  {
    name: "Elm & Bain",
    category: "arts",
    address: "620-B S Elm St, Greensboro, NC 27406",
    location: { lat: 36.0680, lng: -79.7923 },
    description: "Modern event venue in historic textile factory with 11,000 sq ft of flexible space for cultural events.",
    website: "https://www.elmandbain.com/",
    hours: "By appointment",
    featured: false
  },
  {
    name: "Steven Tanger Center for the Performing Arts",
    category: "arts",
    address: "300 N Elm St, Greensboro, NC 27401",
    location: { lat: 36.0750, lng: -79.7920 },
    description: "State-of-the-art performing arts center with 3,000 seats hosting Broadway, concerts, and symphonies.",
    website: "https://www.tangercenter.com/",
    hours: "Box Office: Mon-Fri 10am-5pm, Sat-Sun call for hours",
    featured: true
  },
  {
    name: "Greensboro Cultural Center",
    category: "arts",
    address: "200 N Davie St, Greensboro, NC 27401",
    location: { lat: 36.0730, lng: -79.7940 },
    description: "Multipurpose arts facility with galleries, dance studios, pottery studios, and black box theater.",
    website: "https://www.greensborocultural.com/",
    hours: "Mon-Fri 9am-5pm, Sat 10am-3pm",
    featured: true
  },
  {
    name: "The Odeon Theatre",
    category: "entertainment",
    address: "311 S Greene St, Greensboro, NC 27401",
    location: { lat: 36.0720, lng: -79.7910 },
    description: "Historic theater hosting concerts, classic films, independent movies, and community performances.",
    website: "https://www.odeontheatre.com/",
    hours: "Box Office: Tue-Fri 2pm-6pm, Sat 1pm-5pm",
    featured: false
  },
  {
    name: "LeBauer Park",
    category: "entertainment",
    address: "408 N Elm St, Greensboro, NC 27401",
    location: { lat: 36.0765, lng: -79.7920 },
    description: "Premier downtown park with splash pad, gardens, and hosts 400+ community programs annually.",
    website: "https://www.greensborodowntownparks.org/",
    hours: "Dawn to dusk; programs vary",
    featured: true
  },
  {
    name: "Center City Park",
    category: "entertainment",
    address: "305 S Davie St, Greensboro, NC 27401",
    location: { lat: 36.0720, lng: -79.7940 },
    description: "Urban green space with events, art installations, and community gatherings.",
    website: "https://www.greensborodowntownparks.org/",
    hours: "24/7",
    featured: false
  },
  {
    name: "International Civil Rights Center & Museum",
    category: "arts",
    address: "134 S Elm St, Greensboro, NC 27401",
    location: { lat: 36.0713, lng: -79.7920 },
    description: "Museum dedicated to the Civil Rights Movement with interactive exhibits and educational programs.",
    website: "https://www.sitinmovement.org/",
    hours: "Tue-Sat 10am-4pm, Sun 1pm-5pm",
    featured: true
  }
];

// Infrastructure Suggestions (Urban Design Improvements)
export const seedSuggestions = [
  {
    title: "Protected Bike Lane on South Elm Street",
    category: "bike-infrastructure",
    description: "Currently Elm Street has mixed traffic with cyclists competing with cars. A protected bike lane would encourage cycling and provide safer commute options.",
    improvement: "Install a 5-foot protected bike lane separated from car traffic with physical barriers (planters, bollards, or parked cars) on South Elm Street between Gate City Boulevard and Burtner Street.",
    impact: "quick-win",
    location: { lat: 36.0693, lng: -79.7922, address: "South Elm Street between Gate City Boulevard and Burtner Street" }
  },
  {
    title: "Expanded Sidewalks with Parklets",
    category: "streetscape",
    description: "Many sidewalks downtown are narrow, limiting pedestrian comfort and limiting opportunities for outdoor seating and gathering spaces.",
    improvement: "Widen sidewalks to 12-15 feet and create parklets (small pocket parks with seating, shade, and greenery) every 3-4 blocks on Elm and Market Streets.",
    impact: "medium-term",
    location: { lat: 36.0705, lng: -79.7920, address: "Elm Street and Market Street core" }
  },
  {
    title: "Street Tree Canopy Initiative",
    category: "green-space",
    description: "Limited tree coverage on downtown streets increases heat island effect and reduces pedestrian comfort, especially in summer.",
    improvement: "Plant 100+ street trees (fast-growing varieties like Crape Myrtles and Live Oaks) in tree wells along all downtown streets, prioritizing South Elm Street and Market Street.",
    impact: "medium-term",
    location: { lat: 36.0705, lng: -79.7920, address: "Downtown streets, priority South Elm and Market" }
  },
  {
    title: "Enhanced Pedestrian Crossings",
    category: "safety",
    description: "Several busy intersections lack clear visual pedestrian priority, creating safety concerns and limiting pedestrian confidence.",
    improvement: "Install high-visibility crosswalks (with thermoplastic markings), leading pedestrian intervals (LPI), and improve intersection lighting at key crossings.",
    impact: "quick-win",
    location: { lat: 36.0728, lng: -79.7920, address: "Elm Street at Friendly Avenue and Elm Street at Market Street intersections" }
  },
  {
    title: "Alleyway Activation & Lighting",
    category: "public-art",
    description: "Several downtown alleys between Elm and Market Streets are poorly lit, underutilized, and could be vibrant community spaces.",
    improvement: "Improve lighting, commission public art murals, add benches and planters, and host pop-up events in alleys to create lively 'third spaces' for community gathering.",
    impact: "quick-win",
    location: { lat: 36.0705, lng: -79.7920, address: "Alleys between Elm and Market Streets" }
  },
  {
    title: "Wayfinding Signage System",
    category: "wayfinding",
    description: "Downtown lacks a cohesive wayfinding system, making it difficult for visitors to navigate between attractions, restaurants, and parking.",
    improvement: "Install unified wayfinding signs (pedestrian-scale, at 10-foot intervals) directing visitors to major attractions, parking, transit, and shops with consistent branding.",
    impact: "quick-win",
    location: { lat: 36.0715, lng: -79.7920, address: "Downtown core at major intersections" }
  },
  {
    title: "Improved Pedestrian Lighting",
    category: "lighting",
    description: "Some blocks downtown have poor street lighting, reducing visibility and perceived safety, especially after dark.",
    improvement: "Upgrade LED street lights with warm color temperature (3000K) on all downtown streets and add decorative pendant lights to create ambient evening atmosphere.",
    impact: "medium-term",
    location: { lat: 36.0705, lng: -79.7920, address: "Downtown core streets" }
  },
  {
    title: "Pop-Up Plazas at Key Intersections",
    category: "streetscape",
    description: "Several intersections near restaurants and cultural venues lack gathering spaces where pedestrians can linger and socialize.",
    improvement: "Create temporary or permanent pop-up plazas with movable seating, shade structures, and outdoor games at intersections of Elm & Market, Elm & Friendly, and near LeBauer Park.",
    impact: "quick-win",
    location: { lat: 36.0728, lng: -79.7920, address: "Key intersections: Elm & Market, Elm & Friendly" }
  },
  {
    title: "Improved Stormwater Management with Green Infrastructure",
    category: "green-space",
    description: "Downtown lacks adequate permeable surfaces, causing stormwater runoff to overwhelm drainage systems during heavy rains.",
    improvement: "Install bioswales, rain gardens, and permeable pavement along downtown streets to reduce runoff, improve water quality, and add green aesthetic to streets.",
    impact: "medium-term",
    location: { lat: 36.0705, lng: -79.7920, address: "Downtown streets, especially South Elm" }
  },
  {
    title: "Active Ground Floor Uses",
    category: "buildings",
    description: "A few ground floors along downtown corridors have blank walls or inactive retail spaces, creating dead zones for pedestrians.",
    improvement: "Work with property owners to activate ground floors with retail, art installations, window displays, or transparent façades to increase visual interest and street life.",
    impact: "long-term",
    location: { lat: 36.0705, lng: -79.7920, address: "Downtown retail corridors" }
  },
  {
    title: "Expand BORO Social District",
    category: "public-art",
    description: "The current BORO (Border of Refreshments Outdoors) district is limited to certain areas. Expanding it would encourage outdoor dining and more flexible social gathering.",
    improvement: "Expand the BORO Social District boundaries to include more sidewalk space and create designated outdoor dining zones with weather protection (umbrellas, canopies).",
    impact: "quick-win",
    location: { lat: 36.0705, lng: -79.7920, address: "Downtown dining district" }
  },
  {
    title: "Improved Pedestrian Scale Planting & Streetscape Design",
    category: "streetscape",
    description: "Current streetscape design prioritizes cars with wide vehicle lanes and minimal pedestrian-focused elements like planters and street furniture.",
    improvement: "Redesign streetscape with wider planting areas, benches every 200 feet, and mid-block gathering spaces. Consider tactical urbanism (tactical interventions) along Elm Street.",
    impact: "medium-term",
    location: { lat: 36.0705, lng: -79.7920, address: "Elm Street corridor" }
  },
  {
    title: "Arts-Focused Transit Shelters",
    category: "public-art",
    description: "Downtown transit shelters are minimal and don't reflect the area's vibrant arts culture.",
    improvement: "Replace or redesign transit shelters with artistically-designed structures featuring local artist work, real-time transit info, and built-in seating.",
    impact: "medium-term",
    location: { lat: 36.0720, lng: -79.7920, address: "Downtown bus shelters on Elm and Market" }
  }
];

// Sample Events (Spring 2026)
export const seedEvents = [
  {
    title: "LeBauer Park Spring Concert Series - Rock Night",
    date: "2026-03-20T18:30:00",
    endDate: "2026-03-20T21:00:00",
    location: { lat: 36.0765, lng: -79.7920, address: "LeBauer Park, 408 N Elm St" },
    description: "Free outdoor concert series featuring local rock bands. Bring blankets and lawn chairs. Food and beverages available for purchase.",
    category: "music",
    link: "https://www.greensborodowntownparks.org/events"
  },
  {
    title: "First Friday Art Walk",
    date: "2026-04-03T17:00:00",
    endDate: "2026-04-03T21:00:00",
    location: { lat: 36.0705, lng: -79.7920, address: "Downtown Greensboro - South Elm Arts District" },
    description: "Monthly walking tour of downtown galleries, studios, and cultural venues with special events, artist meet-and-greets, and refreshments.",
    category: "arts",
    link: "https://www.downtowngreensboro.org/"
  },
  {
    title: "Farmers Market at LeBauer Park",
    date: "2026-04-11T08:00:00",
    endDate: "2026-04-11T12:00:00",
    location: { lat: 36.0765, lng: -79.7920, address: "LeBauer Park, 408 N Elm St" },
    description: "Weekly farmers market featuring local produce, artisan goods, and prepared foods from regional farms and vendors.",
    category: "market",
    link: "https://www.greensborodowntownparks.org/"
  },
  {
    title: "Elm Street Spring Festival",
    date: "2026-04-18T10:00:00",
    endDate: "2026-04-18T18:00:00",
    location: { lat: 36.0705, lng: -79.7920, address: "South Elm Street between Gate City Boulevard and Market Street" },
    description: "Street festival celebrating spring with live music, vendor booths, food trucks, activities for kids, and community performances.",
    category: "community",
    link: "https://www.downtowngreensboro.org/"
  },
  {
    title: "PAPERHAND Puppet Project - Spring Performance",
    date: "2026-04-19T19:00:00",
    endDate: "2026-04-19T21:00:00",
    location: { lat: 36.0765, lng: -79.7920, address: "LeBauer Park or Odeon Theatre, downtown" },
    description: "Internationally acclaimed puppet theater company presents a spring performance with imaginative storytelling and visual spectacle.",
    category: "arts",
    link: "https://www.paperhandpuppetintervention.org/"
  },
  {
    title: "Tanger Center - Broadway Touring Production",
    date: "2026-05-02T19:30:00",
    endDate: "2026-05-02T22:00:00",
    location: { lat: 36.0750, lng: -79.7920, address: "Steven Tanger Center for the Performing Arts, 300 N Elm St" },
    description: "World-class Broadway production featuring professional performers. Call or visit website for current show details and ticket information.",
    category: "arts",
    link: "https://www.tangercenter.com/"
  },
  {
    title: "Greensboro Food Truck Rally & Spring Market",
    date: "2026-05-09T11:00:00",
    endDate: "2026-05-09T16:00:00",
    location: { lat: 36.0728, lng: -79.7920, address: "Center City Park, downtown" },
    description: "Local food trucks, pop-up vendors, craft beverages, and live music celebrating spring flavors and community dining.",
    category: "food",
    link: "https://www.downtowngreensboro.org/"
  },
  {
    title: "Elsewhere Museum - May Artist Residency Opening Reception",
    date: "2026-05-15T18:00:00",
    endDate: "2026-05-15T21:00:00",
    location: { lat: 36.0681, lng: -79.7923, address: "Elsewhere Museum, 606 S Elm St" },
    description: "Meet the season's artist-in-residence in this immersive living museum. Experience the collection, new installations, and community gathering.",
    category: "arts",
    link: "https://www.elsewheremuseum.org/"
  }
];
