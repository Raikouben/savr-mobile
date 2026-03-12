import { budgetCategories } from "@/constants/config";
export function calculateBudgetSummary(budget: any, transactions: any[]) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endDate.setHours(23, 59, 59, 999);
  const summary: any = {};

  for (const category of budgetCategories) {
    const categoryKey = category.toLowerCase();
    const budgetAmount = Number(budget[categoryKey]) || 0;

    let actualSpent = 0;

    for (const t of transactions) {
      const matchesCategory =
        t.category?.toLowerCase() === category.toLowerCase();

      const transactionDate = new Date(t.date);
      const withinDate =
        transactionDate >= startDate && transactionDate <= endDate;

      if (matchesCategory && withinDate) {
        actualSpent += Number(t.amount) || 0;
      }
    }

    const difference = budgetAmount - actualSpent;
    const percentageUsed =
      budgetAmount > 0 ? Math.min((actualSpent / budgetAmount) * 100, 100) : 0;

    summary[category] = {
      budgetAmount,
      actualSpent,
      difference,
      percentageUsed,
    };
  }
  return summary;
}

export function calculateTotalBudgetComparison(
  budget: any,
  transactions: any[],
) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endDate.setHours(23, 59, 59, 999);
  // Get total budget (should be stored in budget.total_budget)
  const totalBudget = Number(budget.total_budget) || 0;

  // Calculate total spent from transactions in date range
  let totalSpent = 0;
  for (const tx of transactions) {
    const transactionDate = new Date(tx.date);
    const withinDate =
      transactionDate >= startDate && transactionDate <= endDate;

    if (withinDate) {
      totalSpent += Number(tx.amount) || 0;
    }
  }

  const remaining = totalBudget - totalSpent;
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return {
    totalBudget,
    totalSpent,
    remaining,
    percentageUsed,
  };
}

