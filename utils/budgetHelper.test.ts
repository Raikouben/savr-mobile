import {
  calculateCategoryBudgetUsage,
  calculateTotalBudgetUsage,
} from "./budgetHelper";

const tx = (date: Date, amount: number, category: string) => ({
  date: date.toISOString(),
  amount,
  category,
});

describe("calculateCategoryBudgetUsage", () => {
  it("calculates budget breakdown for a category", () => {
    const budget = { groceries: 100 };
    const transactions = [tx(new Date(), 30, "groceries")];
    const result = calculateCategoryBudgetUsage(budget, transactions);

    expect(result.groceries).toEqual({
      budgetAmount: 100,
      actualSpent: 30,
      difference: 70,
      percentageUsed: 30,
    });
  });

  it("excludes transactions outside the current month", () => {
    const now = new Date();
    const budget = { groceries: 100 };
    const transactions = [
      tx(new Date(now.getFullYear(), now.getMonth(), 15), 30, "groceries"),
      tx(new Date(now.getFullYear(), now.getMonth() - 1, 15), 20, "groceries"),
    ];
    const result = calculateCategoryBudgetUsage(budget, transactions);
    expect(result.groceries.actualSpent).toBe(30);
  });
});

describe("calculateTotalBudgetUsage", () => {
  it("calculates total budget usage correctly", () => {
    const budget = { total_budget: 200 };
    const transactions = [tx(new Date(), 30, "groceries")];
    const result = calculateTotalBudgetUsage(budget, transactions);
    expect(result.totalBudget).toBe(200);
    expect(result.totalSpent).toBe(30);
  });
});
