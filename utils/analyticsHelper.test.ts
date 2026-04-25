import {
  aggregateByTimeRange,
  yAxisConfig,
  categoriseSpending,
  getDateRange,
} from "./analyticsHelper";

const tx = (date: Date, amount: number, category = "groceries") => ({
  date: date.toISOString(),
  amount,
  category,
});

const WEEK = new Date(2024, 0, 15);
const MONTH = new Date(2024, 0, 1);

describe("aggregateByTimeRange", () => {
  it("returns 7 labelled slots for week range", () => {
    const result = aggregateByTimeRange([], "week", undefined, undefined, WEEK);
    expect(result).toHaveLength(7);
    expect(result.map((d) => d.label)).toEqual([
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ]);
  });

  it("sums transactions into the correct day slot", () => {
    const transactions = [
      tx(new Date(2024, 0, 15, 12), 50), // Mon
      tx(new Date(2024, 0, 15, 14), 30), // Mon
    ];
    const result = aggregateByTimeRange(
      transactions,
      "week",
      undefined,
      undefined,
      WEEK,
    );
    expect(result[0].value).toBe(80);
  });

  it("excludes transactions outside the selected week", () => {
    const transactions = [tx(new Date(2024, 0, 22, 12), 100)]; // next week
    const result = aggregateByTimeRange(
      transactions,
      "week",
      undefined,
      undefined,
      WEEK,
    );
    expect(result.every((d) => d.value === 0)).toBe(true);
  });

  it("returns correct number of days for month range", () => {
    expect(aggregateByTimeRange([], "month", MONTH)).toHaveLength(31);
    expect(
      aggregateByTimeRange([], "month", new Date(2023, 1, 1)),
    ).toHaveLength(28);
  });

  it("returns 12 slots for year range", () => {
    expect(aggregateByTimeRange([], "year", undefined, 2024)).toHaveLength(12);
  });

  it("excludes transactions from a different year", () => {
    const transactions = [tx(new Date(2023, 5, 15), 999)];
    const result = aggregateByTimeRange(transactions, "year", undefined, 2024);
    expect(result.every((d) => d.value === 0)).toBe(true);
  });
});

describe("yAxisConfig", () => {
  it("returns a stepValue and maxValue that are multiples of each other", () => {
    [30, 100, 500, 1000].forEach((val) => {
      const { maxValue, stepValue } = yAxisConfig(val);
      expect(maxValue % stepValue).toBe(0);
      expect(maxValue).toBeGreaterThanOrEqual(val);
    });
  });
});

describe("categoriseSpending", () => {
  it("returns empty array for no transactions", () => {
    expect(categoriseSpending([])).toEqual([]);
  });

  it("calculates amounts and percentages correctly", () => {
    const transactions = [
      tx(new Date(), 75, "groceries"),
      tx(new Date(), 25, "entertainment"),
    ];
    const result = categoriseSpending(transactions);
    const groceries = result.find((r) => r.category === "groceries")!;
    expect(groceries.amount).toBe(75);
    expect(groceries.percentage).toBe(75);
    const total = result.reduce((sum, r) => sum + r.percentage, 0);
    expect(total).toBeCloseTo(100);
  });
});

describe("getDateRange", () => {
  it("returns Mon–Sun for week range", () => {
    const { startDate, endDate } = getDateRange(
      "week",
      undefined,
      undefined,
      WEEK,
    );
    expect(startDate.getDay()).toBe(1);
    expect(endDate.getDay()).toBe(0);
    expect(endDate.getDate()).toBe(21);
  });

  it("returns first and last day for month range", () => {
    const { startDate, endDate } = getDateRange("month", MONTH);
    expect(startDate.getDate()).toBe(1);
    expect(endDate.getDate()).toBe(31);
  });

  it("returns Jan 1 to Dec 31 for year range", () => {
    const { startDate, endDate } = getDateRange("year", undefined, 2024);
    expect(startDate.getMonth()).toBe(0);
    expect(endDate.getMonth()).toBe(11);
  });
});
