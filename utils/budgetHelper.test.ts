import {
  calculateBudgetSummary,
  calculateTotalBudgetComparison,
} from "./budgetHelper";

const transaction = (date: Date, amount: number, category = "Food") => ({
  date,
  amount,
  category,
});

const transactions = [
  transaction(new Date(2024, 0, 5), 50, "Food"),
  transaction(new Date(2024, 0, 10), 30, "Transport"),
  transaction(new Date(2024, 0, 15), 20, "Entertainment"),
  transaction(new Date(2024, 0, 20), 100, "Housing"),
];
