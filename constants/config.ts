// API Configuration
// export const API_URL =
//   process.env.EXPO_PUBLIC_RENDER_URL || "http://192.168.1.241:3000/api";

export const API_URL = "http://192.168.1.241:3000/api";

export const budgetCategories = [
  "Housing",
  "Utilities",
  "Transportation",
  "Groceries",
  "Eating Out",
  "Shopping",
  "Health",
  "Entertainment",
  "Savings",
  "Debt",
  "Miscellaneous",
] as const;

export const categoryIcons: Record<(typeof budgetCategories)[number], string> =
  {
    Housing: "home-outline",
    Utilities: "flash-outline",
    Transportation: "car-outline",
    Groceries: "basket-outline",
    "Eating Out": "restaurant-outline",
    Shopping: "cart-outline",
    Health: "fitness-outline",
    Entertainment: "musical-notes-outline",
    Savings: "wallet-outline",
    Debt: "card-outline",
    Miscellaneous: "ellipsis-horizontal-circle-outline",
  };
