// API Configuration
// export const API_URL =
//   process.env.EXPO_PUBLIC_RENDER_URL || "http://192.168.1.241:3000/api";

export const API_URL = "http://192.168.1.241:3000/api";

export const budgetCategories = [
  "Housing",
  "Utilities",
  "Transportation",
  "Food",
  "Shopping",
  "Health",
  "Entertainment",
  "Miscellaneous",
] as const;

export const categoryIcons: Record<(typeof budgetCategories)[number], string> =
  {
    Housing: "home-outline",
    Utilities: "flash-outline",
    Transportation: "car-outline",
    Food: "restaurant-outline",
    Shopping: "cart-outline",
    Health: "fitness-outline",
    Entertainment: "musical-notes-outline",
    Miscellaneous: "ellipsis-horizontal-circle-outline",
  };
