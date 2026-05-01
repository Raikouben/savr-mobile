// API Configuration

// deployment URL - uncomment for production
// export const API_URL = process.env.EXPO_PUBLIC_RENDER_URL;
// local development URL - update with your local IP address
export const API_URL = "http://192.168.1.241:3000/api";


// configure budget fields to reduce boilerplate and ensure consistency across the app
export const categoryConfig = {
  housing: {
    color: "#EF4444",
    icon: "home-outline",
    displayName: "Housing",
    badge: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  },
  utilities: {
    color: "#06B6D4",
    icon: "flash-outline",
    displayName: "Utilities",
    badge: { bg: "#ecfeff", text: "#164e63", border: "#a5f3fc" },
  },
  transportation: {
    color: "#F59E0B",
    icon: "car-outline",
    displayName: "Transport",
    badge: { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  },
  groceries: {
    color: "#8B5CF6",
    icon: "basket-outline",
    displayName: "Groceries",
    badge: { bg: "#f5f3ff", text: "#4c1d95", border: "#ddd6fe" },
  },
  eating_out: {
    color: "#F97316",
    icon: "restaurant-outline",
    displayName: "Eating Out",
    badge: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  },
  shopping: {
    color: "#10B981",
    icon: "cart-outline",
    displayName: "Shopping",
    badge: { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  },
  health: {
    color: "#EC4899",
    icon: "fitness-outline",
    displayName: "Health",
    badge: { bg: "#fdf2f8", text: "#831843", border: "#fbcfe8" },
  },
  entertainment: {
    color: "#3B82F6",
    icon: "musical-notes-outline",
    displayName: "Entertainment",
    badge: { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  },
  savings: {
    color: "#84CC16",
    icon: "wallet-outline",
    displayName: "Savings",
    badge: { bg: "#f7fee7", text: "#3f6212", border: "#d9f99d" },
  },
  debt: {
    color: "#9333EA",
    icon: "card-outline",
    displayName: "Debt",
    badge: { bg: "#faf5ff", text: "#6b21a8", border: "#e9d5ff" },
  },
  miscellaneous: {
    color: "#94A3B8",
    icon: "ellipsis-horizontal-circle-outline",
    displayName: "Other",
    badge: { bg: "#f8fafc", text: "#334155", border: "#cbd5e1" },
  },
};

// export budget categories as an array of keys from the category config for easy iteration and type safety
export const budgetCategories = Object.keys(categoryConfig) as Array<
  keyof typeof categoryConfig
>;

// helper functions to get category properties for consistent use across the app
export const getCategoryColor = (category: string): string => {
  const key = category.toLowerCase() as keyof typeof categoryConfig;
  return categoryConfig[key]?.color;
};

export const getCategoryIcon = (category: string): string => {
  const key = category.toLowerCase() as keyof typeof categoryConfig;
  return categoryConfig[key]?.icon;
};

export const getCategoryDisplayName = (category: string): string => {
  const key = category.toLowerCase() as keyof typeof categoryConfig;
  return categoryConfig[key]?.displayName || category;
};

export const getMerchantCategory = (
  merchantName: string,
): keyof typeof categoryConfig => {
  const merchant = merchants.find((m) => m.name === merchantName);
  return (merchant?.category as keyof typeof categoryConfig) || "miscellaneous";
};

// list of merchants and their associated categories for transaction categorisation
// generated with the help of genAI 
export const merchants = [
  // Groceries
  { name: "Sainsbury's", category: "groceries" },
  { name: "Tesco", category: "groceries" },
  { name: "Asda", category: "groceries" },
  { name: "Morrisons", category: "groceries" },
  { name: "Lidl", category: "groceries" },
  { name: "Aldi", category: "groceries" },
  { name: "Waitrose", category: "groceries" },
  { name: "M&S Food", category: "groceries" },
  { name: "Co-op", category: "groceries" },
  { name: "Iceland", category: "groceries" },
  { name: "Ocado", category: "groceries" },
  { name: "Booths", category: "groceries" },
  { name: "Farmfoods", category: "groceries" },

  // Dining & Takeaway
  { name: "McDonald's", category: "eating_out" },
  { name: "KFC", category: "eating_out" },
  { name: "Burger King", category: "eating_out" },
  { name: "Subway", category: "eating_out" },
  { name: "Greggs", category: "eating_out" },
  { name: "Nando's", category: "eating_out" },
  { name: "Pizza Hut", category: "eating_out" },
  { name: "Domino's", category: "eating_out" },
  { name: "Papa John's", category: "eating_out" },
  { name: "Five Guys", category: "eating_out" },
  { name: "Wagamama", category: "eating_out" },
  { name: "Pret a Manger", category: "eating_out" },
  { name: "Costa Coffee", category: "eating_out" },
  { name: "Starbucks", category: "eating_out" },
  { name: "Caffe Nero", category: "eating_out" },
  { name: "Tim Hortons", category: "eating_out" },
  { name: "Deliveroo", category: "eating_out" },
  { name: "Uber Eats", category: "eating_out" },
  { name: "Just Eat", category: "eating_out" },
  { name: "Wetherspoons", category: "eating_out" },
  { name: "Harvester", category: "eating_out" },
  { name: "Toby Carvery", category: "eating_out" },
  { name: "Pizza Express", category: "eating_out" },
  { name: "Zizzi", category: "eating_out" },
  { name: "Ask Italian", category: "eating_out" },
  { name: "Honest Burgers", category: "eating_out" },
  { name: "Leon", category: "eating_out" },

  // Shopping
  { name: "Amazon", category: "shopping" },
  { name: "ASOS", category: "shopping" },
  { name: "Next", category: "shopping" },
  { name: "H&M", category: "shopping" },
  { name: "Zara", category: "shopping" },
  { name: "Primark", category: "shopping" },
  { name: "Marks & Spencer", category: "shopping" },
  { name: "John Lewis", category: "shopping" },
  { name: "Debenhams", category: "shopping" },
  { name: "Topshop", category: "shopping" },
  { name: "River Island", category: "shopping" },
  { name: "New Look", category: "shopping" },
  { name: "Boohoo", category: "shopping" },
  { name: "Pretty Little Thing", category: "shopping" },
  { name: "Nike", category: "shopping" },
  { name: "Adidas", category: "shopping" },
  { name: "JD Sports", category: "shopping" },
  { name: "Sports Direct", category: "shopping" },
  { name: "Footlocker", category: "shopping" },
  { name: "Schuh", category: "shopping" },
  { name: "Clarks", category: "shopping" },
  { name: "eBay", category: "shopping" },
  { name: "Etsy", category: "shopping" },
  { name: "B&Q", category: "shopping" },
  { name: "Ikea", category: "shopping" },
  { name: "Argos", category: "shopping" },
  { name: "Currys", category: "shopping" },
  { name: "Apple Store", category: "shopping" },
  { name: "Halfords", category: "shopping" },
  { name: "The Range", category: "shopping" },
  { name: "Wilko", category: "shopping" },
  { name: "Dunelm", category: "shopping" },
  { name: "Homesense", category: "shopping" },
  { name: "TK Maxx", category: "shopping" },
  { name: "Matalan", category: "shopping" },

  // Entertainment
  { name: "Netflix", category: "entertainment" },
  { name: "Disney+", category: "entertainment" },
  { name: "Amazon Prime Video", category: "entertainment" },
  { name: "Apple TV+", category: "entertainment" },
  { name: "NOW TV", category: "entertainment" },
  { name: "Sky", category: "entertainment" },
  { name: "BritBox", category: "entertainment" },
  { name: "Paramount+", category: "entertainment" },
  { name: "Spotify", category: "entertainment" },
  { name: "Apple Music", category: "entertainment" },
  { name: "Tidal", category: "entertainment" },
  { name: "Deezer", category: "entertainment" },
  { name: "Audible", category: "entertainment" },
  { name: "Kindle", category: "entertainment" },
  { name: "Steam", category: "entertainment" },
  { name: "PlayStation Store", category: "entertainment" },
  { name: "Xbox Game Pass", category: "entertainment" },
  { name: "Nintendo eShop", category: "entertainment" },
  { name: "Odeon", category: "entertainment" },
  { name: "Cineworld", category: "entertainment" },
  { name: "Vue Cinema", category: "entertainment" },
  { name: "Ticketmaster", category: "entertainment" },
  { name: "See Tickets", category: "entertainment" },
  { name: "National Trust", category: "entertainment" },

  // Health & Pharmacy
  { name: "Boots", category: "health" },
  { name: "Lloyds Pharmacy", category: "health" },
  { name: "Superdrug", category: "health" },
  { name: "Chemist Direct", category: "health" },
  { name: "Pharmacy2U", category: "health" },
  { name: "Holland & Barrett", category: "health" },
  { name: "Specsavers", category: "health" },
  { name: "Vision Express", category: "health" },
  { name: "Nuffield Health", category: "health" },
  { name: "PureGym", category: "health" },
  { name: "The Gym Group", category: "health" },
  { name: "David Lloyd", category: "health" },
  { name: "Anytime Fitness", category: "health" },
  { name: "Dentist", category: "health" },
  { name: "NHS", category: "health" },
  { name: "Bupa", category: "health" },
  { name: "AXA Health", category: "health" },

  // Subscriptions & Tech
  { name: "Google", category: "miscellaneous" },
  { name: "Microsoft 365", category: "miscellaneous" },
  { name: "iCloud", category: "miscellaneous" },
  { name: "Dropbox", category: "miscellaneous" },
  { name: "Adobe", category: "miscellaneous" },
  { name: "Notion", category: "miscellaneous" },
  { name: "Slack", category: "miscellaneous" },
  { name: "Zoom", category: "miscellaneous" },
  { name: "Canva", category: "miscellaneous" },
  { name: "ChatGPT", category: "miscellaneous" },
  { name: "GitHub", category: "miscellaneous" },
  { name: "Figma", category: "miscellaneous" },
  { name: "Duolingo", category: "miscellaneous" },
  { name: "EE", category: "miscellaneous" },
  { name: "O2", category: "miscellaneous" },
  { name: "Vodafone", category: "miscellaneous" },
  { name: "Three", category: "miscellaneous" },
  { name: "Virgin Media", category: "miscellaneous" },
  { name: "BT", category: "miscellaneous" },
  { name: "Sky Broadband", category: "miscellaneous" },
  { name: "TalkTalk", category: "miscellaneous" },
];
