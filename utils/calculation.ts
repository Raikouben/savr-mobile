import { budgetCategories } from "@/constants/config";
export function calculateBudgetSummary(
  budget: any,
  transactions: any[],
  startDate?: string,
  endDate?: string
) {
  const summary: any = {};

  for (const category of budgetCategories) {
    const categoryKey = category.toLowerCase();
    const budgetAmount = budget[categoryKey];

    let actualSpent = 0;

    for (const t of transactions) {
      const matchesCategory = t.category === category;

      const withinDate =
        (!startDate || t.date >= startDate) && (!endDate || t.date <= endDate);

      if (matchesCategory && withinDate) {
        actualSpent += t.amount;
      }
    }

    const difference = budgetAmount - actualSpent;
    const percentageUsed =
      budgetAmount > 0 ? (actualSpent / budgetAmount) * 100 : 0;

    summary[category] = {
      budgetAmount,
      actualSpent,
      difference,
      percentageUsed,
    };
  }

  return summary;
}
