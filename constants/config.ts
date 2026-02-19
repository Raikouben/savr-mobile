// API Configuration
// export const API_URL = process.env.EXPO_PUBLIC_RENDER_URL;

export const API_URL = "http://192.168.1.241:3000/api";

// export const budgetCategories = [
//   "Housing",
//   "Utilities",
//   "Transportation",
//   "Groceries",
//   "Eating_Out",
//   "Shopping",
//   "Health",
//   "Entertainment",
//   "Savings",
//   "Debt",
//   "Miscellaneous",
// ] as const;

// export const categoryIcons: Record<(typeof budgetCategories)[number], string> =
//   {
//     Housing: "home-outline",
//     Utilities: "flash-outline",
//     Transportation: "car-outline",
//     Groceries: "basket-outline",
//     Eating_Out: "restaurant-outline",
//     Shopping: "cart-outline",
//     Health: "fitness-outline",
//     Entertainment: "musical-notes-outline",
//     Savings: "wallet-outline",
//     Debt: "card-outline",
//     Miscellaneous: "ellipsis-horizontal-circle-outline",
//   };

export const categoryConfig = {
  housing: { color: "#EF4444", icon: "home-outline", displayName: "Housing" },
  utilities: {
    color: "#F97316",
    icon: "flash-outline",
    displayName: "Utilities",
  },
  transportation: {
    color: "#F59E0B",
    icon: "car-outline",
    displayName: "Transport",
  },
  groceries: {
    color: "#EAB308",
    icon: "basket-outline",
    displayName: "Groceries",
  },
  eating_out: {
    color: "#84CC16",
    icon: "restaurant-outline",
    displayName: "Eating Out",
  },
  shopping: { color: "#10B981", icon: "cart-outline", displayName: "Shopping" },
  health: { color: "#14B8A6", icon: "fitness-outline", displayName: "Health" },
  entertainment: {
    color: "#3B82F6",
    icon: "musical-notes-outline",
    displayName: "Entertainment",
  },
  savings: { color: "#6366F1", icon: "wallet-outline", displayName: "Savings" },
  debt: { color: "#9333EA", icon: "card-outline", displayName: "Debt" },
  miscellaneous: {
    color: "#EC4899",
    icon: "ellipsis-horizontal-circle-outline",
    displayName: "Other",
  },
};

export const budgetCategories = Object.keys(categoryConfig) as Array<
  keyof typeof categoryConfig
>;

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

export const getMerchantCategory = (merchantName: string): string => {
  const merchant = merchants.find((m) => m.name === merchantName);
  return merchant?.category || "Miscellaneous";
};

export const merchants = [
  // Groceries
  { name: "Sainsbury's", category: "Groceries" },
  { name: "Tesco", category: "Groceries" },
  { name: "Asda", category: "Groceries" },
  { name: "Morrisons", category: "Groceries" },
  { name: "Lidl", category: "Groceries" },
  { name: "Aldi", category: "Groceries" },
  { name: "Waitrose", category: "Groceries" },
  { name: "M&S Food", category: "Groceries" },
  { name: "Co-op", category: "Groceries" },
  { name: "Iceland", category: "Groceries" },
  { name: "Ocado", category: "Groceries" },
  { name: "Booths", category: "Groceries" },
  { name: "Farmfoods", category: "Groceries" },

  // Dining & Takeaway
  { name: "McDonald's", category: "Dining & Takeaway" },
  { name: "KFC", category: "Dining & Takeaway" },
  { name: "Burger King", category: "Dining & Takeaway" },
  { name: "Subway", category: "Dining & Takeaway" },
  { name: "Greggs", category: "Dining & Takeaway" },
  { name: "Nando's", category: "Dining & Takeaway" },
  { name: "Pizza Hut", category: "Dining & Takeaway" },
  { name: "Domino's", category: "Dining & Takeaway" },
  { name: "Papa John's", category: "Dining & Takeaway" },
  { name: "Five Guys", category: "Dining & Takeaway" },
  { name: "Wagamama", category: "Dining & Takeaway" },
  { name: "Pret a Manger", category: "Dining & Takeaway" },
  { name: "Costa Coffee", category: "Dining & Takeaway" },
  { name: "Starbucks", category: "Dining & Takeaway" },
  { name: "Caffe Nero", category: "Dining & Takeaway" },
  { name: "Tim Hortons", category: "Dining & Takeaway" },
  { name: "Deliveroo", category: "Dining & Takeaway" },
  { name: "Uber Eats", category: "Dining & Takeaway" },
  { name: "Just Eat", category: "Dining & Takeaway" },
  { name: "Wetherspoons", category: "Dining & Takeaway" },
  { name: "Harvester", category: "Dining & Takeaway" },
  { name: "Toby Carvery", category: "Dining & Takeaway" },
  { name: "Pizza Express", category: "Dining & Takeaway" },
  { name: "Zizzi", category: "Dining & Takeaway" },
  { name: "Ask Italian", category: "Dining & Takeaway" },
  { name: "Honest Burgers", category: "Dining & Takeaway" },
  { name: "Leon", category: "Dining & Takeaway" },

  // Shopping & Clothing
  { name: "Amazon", category: "Shopping & Clothing" },
  { name: "ASOS", category: "Shopping & Clothing" },
  { name: "Next", category: "Shopping & Clothing" },
  { name: "H&M", category: "Shopping & Clothing" },
  { name: "Zara", category: "Shopping & Clothing" },
  { name: "Primark", category: "Shopping & Clothing" },
  { name: "Marks & Spencer", category: "Shopping & Clothing" },
  { name: "John Lewis", category: "Shopping & Clothing" },
  { name: "Debenhams", category: "Shopping & Clothing" },
  { name: "Topshop", category: "Shopping & Clothing" },
  { name: "River Island", category: "Shopping & Clothing" },
  { name: "New Look", category: "Shopping & Clothing" },
  { name: "Boohoo", category: "Shopping & Clothing" },
  { name: "Pretty Little Thing", category: "Shopping & Clothing" },
  { name: "Nike", category: "Shopping & Clothing" },
  { name: "Adidas", category: "Shopping & Clothing" },
  { name: "JD Sports", category: "Shopping & Clothing" },
  { name: "Sports Direct", category: "Shopping & Clothing" },
  { name: "Footlocker", category: "Shopping & Clothing" },
  { name: "Schuh", category: "Shopping & Clothing" },
  { name: "Clarks", category: "Shopping & Clothing" },
  { name: "eBay", category: "Shopping & Clothing" },
  { name: "Etsy", category: "Shopping & Clothing" },
  { name: "B&Q", category: "Shopping & Clothing" },
  { name: "Ikea", category: "Shopping & Clothing" },
  { name: "Argos", category: "Shopping & Clothing" },
  { name: "Currys", category: "Shopping & Clothing" },
  { name: "Apple Store", category: "Shopping & Clothing" },
  { name: "Halfords", category: "Shopping & Clothing" },
  { name: "The Range", category: "Shopping & Clothing" },
  { name: "Wilko", category: "Shopping & Clothing" },
  { name: "Dunelm", category: "Shopping & Clothing" },
  { name: "Homesense", category: "Shopping & Clothing" },
  { name: "TK Maxx", category: "Shopping & Clothing" },
  { name: "Matalan", category: "Shopping & Clothing" },

  // Entertainment
  { name: "Netflix", category: "Entertainment" },
  { name: "Disney+", category: "Entertainment" },
  { name: "Amazon Prime Video", category: "Entertainment" },
  { name: "Apple TV+", category: "Entertainment" },
  { name: "NOW TV", category: "Entertainment" },
  { name: "Sky", category: "Entertainment" },
  { name: "BritBox", category: "Entertainment" },
  { name: "Paramount+", category: "Entertainment" },
  { name: "Spotify", category: "Entertainment" },
  { name: "Apple Music", category: "Entertainment" },
  { name: "Tidal", category: "Entertainment" },
  { name: "Deezer", category: "Entertainment" },
  { name: "Audible", category: "Entertainment" },
  { name: "Kindle", category: "Entertainment" },
  { name: "Steam", category: "Entertainment" },
  { name: "PlayStation Store", category: "Entertainment" },
  { name: "Xbox Game Pass", category: "Entertainment" },
  { name: "Nintendo eShop", category: "Entertainment" },
  { name: "Odeon", category: "Entertainment" },
  { name: "Cineworld", category: "Entertainment" },
  { name: "Vue Cinema", category: "Entertainment" },
  { name: "Ticketmaster", category: "Entertainment" },
  { name: "See Tickets", category: "Entertainment" },
  { name: "National Trust", category: "Entertainment" },

  // Health & Pharmacy
  { name: "Boots", category: "Health & Pharmacy" },
  { name: "Lloyds Pharmacy", category: "Health & Pharmacy" },
  { name: "Superdrug", category: "Health & Pharmacy" },
  { name: "Chemist Direct", category: "Health & Pharmacy" },
  { name: "Pharmacy2U", category: "Health & Pharmacy" },
  { name: "Holland & Barrett", category: "Health & Pharmacy" },
  { name: "Specsavers", category: "Health & Pharmacy" },
  { name: "Vision Express", category: "Health & Pharmacy" },
  { name: "Nuffield Health", category: "Health & Pharmacy" },
  { name: "PureGym", category: "Health & Pharmacy" },
  { name: "The Gym Group", category: "Health & Pharmacy" },
  { name: "David Lloyd", category: "Health & Pharmacy" },
  { name: "Anytime Fitness", category: "Health & Pharmacy" },
  { name: "Dentist", category: "Health & Pharmacy" },
  { name: "NHS", category: "Health & Pharmacy" },
  { name: "Bupa", category: "Health & Pharmacy" },
  { name: "AXA Health", category: "Health & Pharmacy" },

  // Subscriptions & Tech
  { name: "Google", category: "Subscriptions & Tech" },
  { name: "Microsoft 365", category: "Subscriptions & Tech" },
  { name: "iCloud", category: "Subscriptions & Tech" },
  { name: "Dropbox", category: "Subscriptions & Tech" },
  { name: "Adobe", category: "Subscriptions & Tech" },
  { name: "Notion", category: "Subscriptions & Tech" },
  { name: "Slack", category: "Subscriptions & Tech" },
  { name: "Zoom", category: "Subscriptions & Tech" },
  { name: "Canva", category: "Subscriptions & Tech" },
  { name: "ChatGPT", category: "Subscriptions & Tech" },
  { name: "GitHub", category: "Subscriptions & Tech" },
  { name: "Figma", category: "Subscriptions & Tech" },
  { name: "Duolingo", category: "Subscriptions & Tech" },
  { name: "EE", category: "Subscriptions & Tech" },
  { name: "O2", category: "Subscriptions & Tech" },
  { name: "Vodafone", category: "Subscriptions & Tech" },
  { name: "Three", category: "Subscriptions & Tech" },
  { name: "Virgin Media", category: "Subscriptions & Tech" },
  { name: "BT", category: "Subscriptions & Tech" },
  { name: "Sky Broadband", category: "Subscriptions & Tech" },
  { name: "TalkTalk", category: "Subscriptions & Tech" },
];

export const categoryColors = {
  Groceries: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  "Dining & Takeaway": { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" },
  "Shopping & Clothing": { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  Entertainment: { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
  "Health & Pharmacy": { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3" },
  "Subscriptions & Tech": { bg: "#f0f9ff", text: "#0c4a6e", border: "#bae6fd" },
};

export const merchantCategoryMap: Record<
  keyof typeof categoryColors,
  keyof typeof categoryConfig
> = {
  Groceries: "groceries",
  "Dining & Takeaway": "eating_out",
  "Shopping & Clothing": "shopping",
  Entertainment: "entertainment",
  "Health & Pharmacy": "health",
  "Subscriptions & Tech": "miscellaneous",
};
