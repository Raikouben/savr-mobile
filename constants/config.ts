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
