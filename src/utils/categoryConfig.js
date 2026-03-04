import {
  UtensilsCrossed, Wine, Coffee, ShoppingBag, Wrench, Palette, Zap, Activity,
  Heart, Lightbulb, CalendarHeart, Sparkles, Store, Newspaper
} from 'lucide-react';

export const BUSINESS_CATEGORY_CONFIG = {
  'Restaurants': {
    icon: UtensilsCrossed,
    gradient: 'from-orange-600/40 to-red-600/20',
    hoverBorder: 'hover:border-orange-500/30',
    hoverShadow: 'hover:shadow-orange-500/5',
    hoverText: 'group-hover:text-orange-300',
    accent: 'text-orange-400',
    iconColor: 'text-orange-400/40',
  },
  'Bars & Breweries': {
    icon: Wine,
    gradient: 'from-amber-600/40 to-yellow-600/20',
    hoverBorder: 'hover:border-amber-500/30',
    hoverShadow: 'hover:shadow-amber-500/5',
    hoverText: 'group-hover:text-amber-300',
    accent: 'text-amber-400',
    iconColor: 'text-amber-400/40',
  },
  'Coffee & Cafes': {
    icon: Coffee,
    gradient: 'from-yellow-600/40 to-amber-600/20',
    hoverBorder: 'hover:border-yellow-500/30',
    hoverShadow: 'hover:shadow-yellow-500/5',
    hoverText: 'group-hover:text-yellow-300',
    accent: 'text-yellow-400',
    iconColor: 'text-yellow-400/40',
  },
  'Retail': {
    icon: ShoppingBag,
    gradient: 'from-pink-600/40 to-rose-600/20',
    hoverBorder: 'hover:border-pink-500/30',
    hoverShadow: 'hover:shadow-pink-500/5',
    hoverText: 'group-hover:text-pink-300',
    accent: 'text-pink-400',
    iconColor: 'text-pink-400/40',
  },
  'Services': {
    icon: Wrench,
    gradient: 'from-slate-600/40 to-gray-600/20',
    hoverBorder: 'hover:border-slate-500/30',
    hoverShadow: 'hover:shadow-slate-500/5',
    hoverText: 'group-hover:text-slate-300',
    accent: 'text-slate-400',
    iconColor: 'text-slate-400/40',
  },
  'Arts & Culture': {
    icon: Palette,
    gradient: 'from-fuchsia-600/40 to-purple-600/20',
    hoverBorder: 'hover:border-fuchsia-500/30',
    hoverShadow: 'hover:shadow-fuchsia-500/5',
    hoverText: 'group-hover:text-fuchsia-300',
    accent: 'text-fuchsia-400',
    iconColor: 'text-fuchsia-400/40',
  },
  'Entertainment': {
    icon: Zap,
    gradient: 'from-violet-600/40 to-indigo-600/20',
    hoverBorder: 'hover:border-violet-500/30',
    hoverShadow: 'hover:shadow-violet-500/5',
    hoverText: 'group-hover:text-violet-300',
    accent: 'text-violet-400',
    iconColor: 'text-violet-400/40',
  },
  'Fitness & Wellness': {
    icon: Activity,
    gradient: 'from-teal-600/40 to-cyan-600/20',
    hoverBorder: 'hover:border-teal-500/30',
    hoverShadow: 'hover:shadow-teal-500/5',
    hoverText: 'group-hover:text-teal-300',
    accent: 'text-teal-400',
    iconColor: 'text-teal-400/40',
  },
};

export const POST_CATEGORY_CONFIG = {
  'What I Love': {
    icon: Heart,
    gradient: 'from-pink-600/30 to-rose-600/10',
    hoverBorder: 'hover:border-pink-500/30',
    hoverShadow: 'hover:shadow-pink-500/5',
    hoverText: 'group-hover:text-pink-300',
    accent: 'text-pink-400',
    iconColor: 'text-pink-400/30',
  },
  'Opportunity': {
    icon: Lightbulb,
    gradient: 'from-emerald-600/30 to-green-600/10',
    hoverBorder: 'hover:border-emerald-500/30',
    hoverShadow: 'hover:shadow-emerald-500/5',
    hoverText: 'group-hover:text-emerald-300',
    accent: 'text-emerald-400',
    iconColor: 'text-emerald-400/30',
  },
  'Event': {
    icon: CalendarHeart,
    gradient: 'from-purple-600/30 to-violet-600/10',
    hoverBorder: 'hover:border-purple-500/30',
    hoverShadow: 'hover:shadow-purple-500/5',
    hoverText: 'group-hover:text-purple-300',
    accent: 'text-purple-400',
    iconColor: 'text-purple-400/30',
  },
  'Business Spotlight': {
    icon: Sparkles,
    gradient: 'from-amber-600/30 to-yellow-600/10',
    hoverBorder: 'hover:border-amber-500/30',
    hoverShadow: 'hover:shadow-amber-500/5',
    hoverText: 'group-hover:text-amber-300',
    accent: 'text-amber-400',
    iconColor: 'text-amber-400/30',
  },
};

const defaultBusinessConfig = {
  icon: Store,
  gradient: 'from-purple-600/40 to-indigo-600/20',
  hoverBorder: 'hover:border-purple-500/30',
  hoverShadow: 'hover:shadow-purple-500/5',
  hoverText: 'group-hover:text-purple-300',
  accent: 'text-purple-400',
  iconColor: 'text-purple-400/40',
};

const defaultPostConfig = {
  icon: Newspaper,
  gradient: 'from-emerald-600/30 to-green-600/10',
  hoverBorder: 'hover:border-emerald-500/30',
  hoverShadow: 'hover:shadow-emerald-500/5',
  hoverText: 'group-hover:text-emerald-300',
  accent: 'text-emerald-400',
  iconColor: 'text-emerald-400/30',
};

// Map Firestore shorthand categories to config keys
const businessAliases = {
  'restaurants': 'Restaurants',
  'restaurant': 'Restaurants',
  'bars': 'Bars & Breweries',
  'bar': 'Bars & Breweries',
  'breweries': 'Bars & Breweries',
  'coffee': 'Coffee & Cafes',
  'cafe': 'Coffee & Cafes',
  'cafes': 'Coffee & Cafes',
  'retail': 'Retail',
  'shopping': 'Retail',
  'services': 'Services',
  'service': 'Services',
  'arts': 'Arts & Culture',
  'art': 'Arts & Culture',
  'culture': 'Arts & Culture',
  'entertainment': 'Entertainment',
  'fitness': 'Fitness & Wellness',
  'wellness': 'Fitness & Wellness',
};

// Reverse map: title-case config key → list of aliases
const reverseAliases = {};
for (const [alias, configKey] of Object.entries(businessAliases)) {
  if (!reverseAliases[configKey]) reverseAliases[configKey] = [];
  reverseAliases[configKey].push(alias);
}

// Check if a Firestore category matches a filter category (title-case)
export function matchesBusinessCategory(firestoreCategory, filterCategory) {
  if (!firestoreCategory || !filterCategory) return false;
  if (firestoreCategory === filterCategory) return true;
  // Check if the Firestore value is an alias for the filter category
  const resolved = businessAliases[firestoreCategory] || businessAliases[firestoreCategory.toLowerCase()];
  return resolved === filterCategory;
}

export function getBusinessConfig(category) {
  if (!category) return defaultBusinessConfig;
  // Try exact match first, then alias, then lowercase alias
  return BUSINESS_CATEGORY_CONFIG[category]
    || BUSINESS_CATEGORY_CONFIG[businessAliases[category]]
    || BUSINESS_CATEGORY_CONFIG[businessAliases[category.toLowerCase()]]
    || defaultBusinessConfig;
}

export function getPostConfig(category) {
  return POST_CATEGORY_CONFIG[category] || defaultPostConfig;
}
