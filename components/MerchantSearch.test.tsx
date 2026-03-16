import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import MerchantSearch from "./MerchantSearch";

jest.mock("@/constants/config", () => ({
  merchants: [
    { name: "Sainsbury's", category: "groceries" },
    { name: "Tesco", category: "groceries" },
    { name: "Asda", category: "groceries" },
    { name: "Starbucks", category: "eating_out" },
    { name: "Costa Coffee", category: "eating_out" },
    { name: "Apple TV+", category: "entertainment" },
    { name: "Apple Music", category: "entertainment" },
    { name: "Apple Store", category: "shopping" },
  ],
  categoryConfig: {
    groceries: {
      displayName: "Groceries",
      badge: { bg: "#E8F5E9", text: "#2E7D32" },
    },
    eating_out: {
      displayName: "Eating Out",
      badge: { bg: "#FFF3E0", text: "#E65100" },
    },
    entertainment: {
      displayName: "Entertainment",
      badge: { bg: "#E3F2FD", text: "#1565C0" },
    },
    shopping: {
      displayName: "Shopping",
      badge: { bg: "#ECEFF1", text: "#263238" },
    },
  },
}));

describe("MerchantSearch", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it("shows no results when query is empty", () => {
    render(<MerchantSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText("Search e.g. Sainsbury's");

    fireEvent.changeText(input, "Sainsbury");
    expect(screen.getByText("Sainsbury's")).toBeTruthy();

    fireEvent.changeText(input, "");
    expect(screen.queryByText("Sainsbury's")).toBeNull();
  });

  it("shows filtered results when typing", () => {
    render(<MerchantSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText("Search e.g. Sainsbury's");
    fireEvent.changeText(input, "Apple");

    expect(screen.getByText("Apple TV+")).toBeTruthy();
    expect(screen.getByText("Apple Music")).toBeTruthy();
    expect(screen.getByText("Apple Store")).toBeTruthy();
  });

  it("filters results with fuzzy matching", () => {
    render(<MerchantSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText("Search e.g. Sainsbury's");
    fireEvent.changeText(input, "sain");

    expect(screen.getByText("Sainsbury's")).toBeTruthy();
  });

  it("calls onSelect when merchant is selected", () => {
    render(<MerchantSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText("Search e.g. Sainsbury's");
    fireEvent.changeText(input, "Starbucks");

    const merchantItem = screen.getByText("Starbucks");
    fireEvent.press(merchantItem);

    expect(mockOnSelect).toHaveBeenCalledWith({
      name: "Starbucks",
      category: "eating_out",
    });
  });

  it("sets query to merchant name after selection", () => {
    render(<MerchantSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText("Search e.g. Sainsbury's");
    fireEvent.changeText(input, "Costa");

    const merchantItem = screen.getByText("Costa Coffee");
    fireEvent.press(merchantItem);

    expect(input.props.value).toBe("Costa Coffee");
  });
});
