import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import Transactions from "./transactions";

jest.mock("@/hooks/queries/transactionQuery", () => ({
  useTransactionQuery: () => ({
    transactions: [
      {
        id: 1,
        category: "groceries",
        date: "2024-03-15",
        description: "Weekly shopping",
        amount: "50.00",
      },
      {
        id: 2,
        category: "eating_out",
        date: "2024-03-14",
        description: "Coffee with friends",
        amount: "15.50",
      },
      {
        id: 3,
        category: "entertainment",
        date: "2024-03-13",
        description: "Cinema",
        amount: "12.00",
      },
    ],
    isLoading: false,
    deleteTransaction: jest.fn(),
    isDeleting: false,
  }),
}));

jest.mock("@/themes/useAppTheme", () => ({
  useAppTheme: () => ({
    backgroundColor: "#fff",
    textColor: "#000",
    textOnPrimary: "#fff",
    surfaceColor: "#f5f5f5",
  }),
}));

jest.mock("@/constants/config", () => ({
  getCategoryDisplayName: (category: string) => {
    const names: Record<string, string> = {
      groceries: "Groceries",
      eating_out: "Eating Out",
      entertainment: "Entertainment",
    };
    return names[category] || category;
  },
  getCategoryIcon: (category: string) => "receipt",
  getCategoryColor: (category: string) => "#000000",
}));

jest.mock("@/components/AddTransaction", () => "AddTransaction");
jest.mock("@/components/addBulkTransaction", () => "AddBulkTransaction");
jest.mock("@/components/addSubscription", () => "AddSubscription");
jest.mock("@/components/DateSelector", () => "DateSelector");
jest.mock("@/components/CategoryPicker", () => "CategoryPicker");
jest.mock("@/components/CategoryFilter", () => "CategoryFilter");

describe("Transactions Screen", () => {
  it("displays transaction items on screen", () => {
    render(<Transactions />);

    expect(screen.getByText("Transactions")).toBeTruthy();
    expect(screen.getByText("Groceries")).toBeTruthy();
    expect(screen.getByText(/Weekly shopping/)).toBeTruthy();
  });

  it("displays multiple transactions", () => {
    render(<Transactions />);

    expect(screen.getByText("Eating Out")).toBeTruthy();
    expect(screen.getByText(/Coffee with friends/)).toBeTruthy();

    expect(screen.getByText("Entertainment")).toBeTruthy();
    expect(screen.getByText(/Cinema/)).toBeTruthy();
  });
});
