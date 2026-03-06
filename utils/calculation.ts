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
export function getDateRange(
  range: "week" | "month" | "year",
  selectedMonthYear?: Date,
  selectedYear?: number,
  selectedWeek?: Date,
): { startDate: Date; endDate: Date } {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  if (range === "week") {
    const targetWeek = selectedWeek || now;
    const dayOfWeek = targetWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    startDate = new Date(targetWeek);
    startDate.setDate(targetWeek.getDate() - daysToMonday);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
  } else if (range === "month") {
    const targetDate = selectedMonthYear || now;
    startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);
  } else {
    const targetYear = selectedYear || now.getFullYear();
    startDate = new Date(targetYear, 0, 1);
    endDate = new Date(targetYear, 11, 31);
    endDate.setHours(23, 59, 59, 999);
  }

  return { startDate, endDate };
}
export function aggregateByTimeRange(
  transactions: any[],
  range: "week" | "month" | "year",
  selectedMonthYear?: Date,
  selectedYear?: number,
  selectedWeek?: Date,
) {
  const now = new Date();

  // STEP 1: Figure out what date range we're looking at
  const { startDate, endDate } = getDateRange(
    range,
    selectedMonthYear,
    selectedYear,
    selectedWeek,
  );
  // STEP 2: Group transactions and sum by time period
  // (Skip the filtering step - just check dates while grouping)
  const totals: { [key: string]: number } = {};

  for (const tx of transactions) {
    const txDate = new Date(tx.date);

    // Skip if outside date range
    if (txDate < startDate || txDate > endDate) continue;

    let label: string;
    if (range === "week") {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      label = dayNames[txDate.getUTCDay()];
    } else if (range === "month") {
      label = String(txDate.getUTCDate());
    } else {
      label = String(txDate.getUTCMonth()); // 0–11
    }

    if (!totals[label]) totals[label] = 0;
    totals[label] += Number(tx.amount);
  }

  // STEP 3: Build chart data
  const chartData: Array<{ value: number; label: string }> = [];

  if (range === "week") {
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (const day of weekDays) {
      chartData.push({ value: totals[day] || 0, label: day });
    }
  } else if (range === "month") {
    const daysInMonth = endDate.getUTCDate();
    for (let day = 1; day <= daysInMonth; day++) {
      chartData.push({
        value: totals[String(day)] || 0,
        label: day === 1 || day % 5 === 0 ? String(day) : "",
      });
    }
  } else {
    const monthLabels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    for (let i = 0; i < 12; i++) {
      chartData.push({ value: totals[String(i)] || 0, label: monthLabels[i] });
    }
  }

  return chartData;
}

export function formatChartLabel(
  key: string,
  range: "week" | "month" | "year",
  index: number,
  total: number,
): string {
  if (range === "week") {
    return key; // Mon, Tue, etc.
  } else if (range === "month") {
    // Show every 5th day
    return index % 5 === 0 ? key : "";
  } else {
    return key; // Jan, Feb, etc.
  }
}
