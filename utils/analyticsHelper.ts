export function aggregateByTimeRange(
  transactions: any[],
  range: "week" | "month" | "year",
  selectedMonthYear?: Date,
  selectedYear?: number,
  selectedWeek?: Date
) {
  const now = new Date();

  // STEP 1: Figure out what date range we're looking at
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
      label = txDate.toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      });
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
    const monthLabels = [
      "J",
      "F",
      "M",
      "A",
      "M",
      "J",
      "J",
      "A",
      "S",
      "O",
      "N",
      "D",
    ];
    for (const month of monthLabels) {
      chartData.push({ value: totals[month] || 0, label: month });
    }
  }

  return chartData;
}

export function formatChartLabel(
  key: string,
  range: "week" | "month" | "year",
  index: number,
  total: number
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

export function yAxisConfig(maxValue: number) {
  const numberOfSteps = 6;
  const stepValue = Math.ceil(maxValue / numberOfSteps / 100) * 100 || 100;
  return {
    maxValue: Math.ceil(maxValue / stepValue) * stepValue,
    stepValue: stepValue,
  };
}
