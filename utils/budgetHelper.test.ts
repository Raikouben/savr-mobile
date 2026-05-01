import {
  calculateCategoryBudgetUsage,
  calculateTotalBudgetUsage,
} from "./budgetHelper";

const tx = (date: string, amount: number, category: string) => ({
  date,
  amount,
  category,
});

const baseBudget = {
  start_date: "2025-04-04",
  end_date: "2025-05-04",
  groceries: 100,
  total_budget: 200,
};

describe("calculateCategoryBudgetUsage", () => {
  it("calculates budget breakdown for a category", () => {
    const result = calculateCategoryBudgetUsage(baseBudget, [
      tx("2025-04-15", 30, "groceries"),
    ]);
    expect(result.groceries).toEqual({
      budgetAmount: 100,
      actualSpent: 30,
      difference: 70,
      percentageUsed: 30,
    });
  });

  it("excludes transactions outside the current month", () => {
    const transactions = [
      tx("2025-04-15", 30, "groceries"),
      tx("2025-03-15", 20, "groceries"),
    ];
    const result = calculateCategoryBudgetUsage(baseBudget, transactions);
    expect(result.groceries.actualSpent).toBe(30);
  });
});

describe("calculateTotalBudgetUsage", () => {
  it("calculates total budget usage correctly", () => {
    const transactions = [tx("2025-04-15", 30, "groceries")];
    const result = calculateTotalBudgetUsage(baseBudget, transactions);
    expect(result.totalBudget).toBe(200);
    expect(result.totalSpent).toBe(30);
  });
});
